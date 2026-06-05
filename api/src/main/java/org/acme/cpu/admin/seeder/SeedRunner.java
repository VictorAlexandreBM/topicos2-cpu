package org.acme.cpu.admin.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.cpu.admin.models.*;
import org.acme.cpu.admin.models.enums.TipoNucleo;
import org.acme.cpu.admin.repositories.*;
import org.jboss.logging.Logger;
import org.acme.cpu.core.clients.SeaweedFsClient;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.UUID;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class SeedRunner {

    @Inject
    Logger LOG;

    @Inject
    ObjectMapper objectMapper;

    @Inject MarcaRepository marcaRepository;
    @Inject SocketRepository socketRepository;
    @Inject ChipsetRepository chipsetRepository;
    @Inject TecnologiaRepository tecnologiaRepository;
    @Inject ModeloCpuRepository modeloCpuRepository;
    @Inject CpuRepository cpuRepository;
    @Inject @RestClient SeaweedFsClient seaweedFsClient;

    @Transactional
    public void onStart(@Observes StartupEvent ev) {
        if (marcaRepository.count() > 0) {
            LOG.info("Banco de dados já populado. Pulando Seeder.");
            return;
        }

        LOG.info("Iniciando lotação do banco de dados...");

        try {
            seedMarcas();
            seedSockets();
            seedChipsets();
            seedTecnologias();
            seedModelos();
            seedCpus();
            LOG.info("Lotação concluída com sucesso.");
        } catch (Exception e) {
            LOG.error("Falha ao popular o banco de dados", e);
        }
    }

    private InputStream getStream(String filename) {
        return Thread.currentThread().getContextClassLoader().getResourceAsStream("seeds/admin/" + filename);
    }

    private void seedMarcas() throws Exception {
        List<Marca> marcas = objectMapper.readValue(getStream("marcas.json"), new TypeReference<>() {});
        marcaRepository.persist(marcas);
    }

    private void seedSockets() throws Exception {
        List<Socket> sockets = objectMapper.readValue(getStream("sockets.json"), new TypeReference<>() {});
        socketRepository.persist(sockets);
    }

    private void seedChipsets() throws Exception {
        List<Chipset> chipsets = objectMapper.readValue(getStream("chipsets.json"), new TypeReference<>() {});
        chipsetRepository.persist(chipsets);
    }

    private void seedTecnologias() throws Exception {
        List<Tecnologia> tecnologias = objectMapper.readValue(getStream("tecnologia.json"), new TypeReference<>() {});
        tecnologiaRepository.persist(tecnologias);
    }

    private void seedModelos() throws Exception {
        JsonNode root = objectMapper.readTree(getStream("modelos-cpu.json"));

        for (JsonNode node : root) {
            ModeloCpu modelo = new ModeloCpu();
            modelo.setNome(node.get("nome").asText());

            // Relacionamentos simples
            Marca marca = marcaRepository.find("nome", node.get("marca").asText()).firstResult();
            Socket socket = socketRepository.find("tipo", node.get("socket").asText()).firstResult();
            modelo.setMarca(marca);
            modelo.setSocket(socket);

            // Relacionamentos N:M (Chipsets)
            Set<Chipset> chipsets = new HashSet<>();
            for (JsonNode cNode : node.get("chipsets")) {
                chipsets.add(chipsetRepository.find("tipo", cNode.asText()).firstResult());
            }
            modelo.setChipsets(chipsets);

            // Relacionamentos N:M (Tecnologias)
            Set<Tecnologia> tecnologias = new HashSet<>();
            for (JsonNode tNode : node.get("tecnologias")) {
                tecnologias.add(tecnologiaRepository.find("nome", tNode.asText()).firstResult());
            }
            modelo.setTecnologias(tecnologias);

            // Ficha Técnica (Embutida/Composição)
            FichaTecnica ficha = new FichaTecnica();
            JsonNode fNode = node.get("fichaTecnica");
            ficha.setDescricaoComercial(fNode.get("descricaoComercial").asText());
            ficha.setTdpBaseW(fNode.get("tdpBaseW").asInt());
            ficha.setCacheL2MB(fNode.get("cacheL2MB").asDouble());
            ficha.setCacheL3MB(fNode.get("cacheL3MB").asDouble());
            modelo.setFichaTecnica(ficha);

            // Clusters (1:N)
            List<ClusterNucleo> clusters = new ArrayList<>();
            for (JsonNode clNode : node.get("clustersNucleo")) {
                ClusterNucleo cluster = new ClusterNucleo();
                // Assumindo que TipoNucleo seja um Enum (PERFORMANCE, EFICIENCIA)
                cluster.setTipoNucleo(TipoNucleo.valueOf(clNode.get("tipoNucleo").asText()));
                cluster.setQuantidadeNucleos(clNode.get("quantidadeNucleos").asInt());
                cluster.setFrequenciaBase(clNode.get("frequenciaBase").asDouble());
                cluster.setFrequenciaMaxima(clNode.get("frequenciaMaxima").asDouble());
                clusters.add(cluster);
            }
            modelo.setClustersNucleo(new HashSet<>(clusters));

            modeloCpuRepository.persist(modelo);
        }
    }

    private void seedCpus() throws Exception {
        JsonNode root = objectMapper.readTree(getStream("cpus.json"));

        for (JsonNode node : root) {
            String tipo = node.get("tipo").asText();
            Cpu cpu = tipo.equals("BOX") ? new CpuBox() : new CpuTray();

            cpu.setSku(node.get("sku").asText());
            cpu.setNomeComercial(node.get("nomeComercial").asText());
            cpu.setPreco(BigDecimal.valueOf(node.get("preco").asDouble()));
            cpu.setEstoque(node.get("estoque").asInt());
            cpu.setDataInclusao(LocalDate.parse(node.get("dataInclusao").asText()));
            cpu.setEmVenda(node.get("emVenda").asBoolean());

            ModeloCpu modelo = modeloCpuRepository.find("nome", node.get("modelo").asText()).firstResult();
            cpu.setModelo(modelo);

            if (cpu instanceof CpuBox box) {
                box.setIncluiCooler(node.get("incluiCooler").asBoolean());
                box.setPesoEmbalagemGramas(node.get("pesoEmbalagemGramas").asDouble());
            } else if (cpu instanceof CpuTray tray) {
                tray.setLoteFabricacao(node.get("loteFabricacao").asText());
            }

            // Persiste primeiro para gerar o ID da CPU
            cpuRepository.persist(cpu);

            // Processamento da Imagem no SeaweedFS
            String imagemRelativa = node.get("imagemUrl").asText();
            if (imagemRelativa != null && !imagemRelativa.isBlank()) {
                String caminhoResource = imagemRelativa.startsWith("/") ? imagemRelativa.substring(1) : imagemRelativa;

                try (InputStream is = getStream(caminhoResource)) {
                    if (is != null) {
                        String nomeArquivoGerado = "cpu-" + cpu.getId() + "-" + UUID.randomUUID().toString().substring(0, 8) + ".jpg";

                        // Envio direto do Stream! Zero I/O de disco no sistema operacional.
                        seaweedFsClient.enviarArquivoStream("cpus", nomeArquivoGerado, is);

                        String urlAcesso = "http://localhost:8888/cpus/" + nomeArquivoGerado;
                        cpu.setImagemUrl(urlAcesso);

                    } else {
                        LOG.warnf("Arquivo físico não encontrado no projeto para semear: %s", caminhoResource);
                    }
                } catch (Exception e) {
                    LOG.errorf(e, "Falha ao enviar a imagem %s para o SeaweedFS durante o seed.", imagemRelativa);
                }
            }
        }
    }
}