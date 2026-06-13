package org.acme.cpu.cliente.seeder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.runtime.StartupEvent;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.cpu.cliente.models.Cidade;
import org.acme.cpu.cliente.models.Endereco;
import org.acme.cpu.cliente.models.Estado;
import org.acme.cpu.cliente.models.Telefone;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.models.enums.Perfil;
import org.acme.cpu.cliente.repositories.CidadeRepository;
import org.acme.cpu.cliente.repositories.EstadoRepository;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.acme.cpu.pedido.models.Cartao;
import org.jboss.logging.Logger;

import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class ClienteSeedRunner {

    @Inject Logger LOG;
    @Inject ObjectMapper objectMapper;
    @Inject UsuarioRepository usuarioRepository;
    @Inject EstadoRepository estadoRepository;
    @Inject CidadeRepository cidadeRepository;

    @Transactional
    public void onStart(@Observes @Priority(2) StartupEvent ev) {
        if (estadoRepository.count() == 0) {
            try {
                seedEstados();
                LOG.info("[ClienteSeedRunner] Estados e cidades populados.");
            } catch (Exception e) {
                LOG.error("[ClienteSeedRunner] Falha ao popular estados/cidades", e);
            }
        }

        if (usuarioRepository.count() > 0) {
            LOG.info("[ClienteSeedRunner] Banco de usuários já populado. Pulando Seeder.");
            return;
        }

        LOG.info("[ClienteSeedRunner] Iniciando lotação de usuários...");

        try {
            seedUsuarios();
            LOG.info("[ClienteSeedRunner] Lotação de usuários concluída com sucesso.");
        } catch (Exception e) {
            LOG.error("[ClienteSeedRunner] Falha ao popular a base de usuários", e);
        }
    }

    private InputStream getStream(String filename) {
        return Thread.currentThread().getContextClassLoader().getResourceAsStream("seeds/cliente/" + filename);
    }

    private InputStream getAdminStream(String filename) {
        return Thread.currentThread().getContextClassLoader().getResourceAsStream("seeds/admin/" + filename);
    }

    private void seedEstados() throws Exception {
        JsonNode root = objectMapper.readTree(getAdminStream("cidades.json"));

        for (JsonNode node : root) {
            Estado estado = new Estado();
            estado.setSigla(node.get("sigla").asText());
            estado.setNome(node.get("nome").asText());

            for (JsonNode cidadeNode : node.get("cidades")) {
                Cidade cidade = new Cidade();

                cidade.setNome(cidadeNode.get("nome").asText());

                cidade.setEstado(estado);
                estado.getCidades().add(cidade);
            }

            estadoRepository.persist(estado);
        }
    }

    private void seedUsuarios() throws Exception {
        JsonNode root = objectMapper.readTree(getStream("usuarios.json"));

        for (JsonNode node : root) {
            Usuario usuario = new Usuario();
            usuario.setEmail(node.get("email").asText());

            String senhaCrua = node.get("senha").asText();
            usuario.setSenha(BcryptUtil.bcryptHash(senhaCrua));

            usuario.setPerfil(Perfil.fromTipo(node.get("perfil").asText()));
            usuario.setPrimeiroNome(node.get("primeiroNome").asText());
            usuario.setSobrenome(node.get("sobrenome").asText());
            usuario.setAtivo(node.get("ativo").asBoolean());

            if (node.hasNonNull("telefones")) {
                Set<Telefone> telefones = new HashSet<>();
                for (JsonNode telNode : node.get("telefones")) {
                    Telefone t = new Telefone();
                    t.setNumero(telNode.get("numero").asText());
                    t.setPrincipal(telNode.get("principal").asBoolean());
                    telefones.add(t);
                }
                usuario.setTelefones(telefones);
            }

            if (node.hasNonNull("enderecos")) {
                Set<Endereco> enderecos = new HashSet<>();
                for (JsonNode endNode : node.get("enderecos")) {
                    String cidadeNome = endNode.get("cidade").asText();
                    String estadoSigla = endNode.get("estado").asText();

                    Cidade cidade = cidadeRepository
                            .findByNomeAndEstadoSigla(cidadeNome, estadoSigla)
                            .orElseThrow(() -> new RuntimeException(
                                    "Cidade não encontrada no seed: " + cidadeNome + " - " + estadoSigla));

                    Endereco e = new Endereco();
                    e.setCep(endNode.get("cep").asText());
                    e.setLogradouro(endNode.get("logradouro").asText());
                    e.setNumero(endNode.get("numero").asText());
                    e.setQuadra(endNode.get("quadra").asText());
                    e.setBairro(endNode.get("bairro").asText());
                    e.setCidade(cidade);

                    if (endNode.hasNonNull("complemento")) {
                        e.setComplemento(endNode.get("complemento").asText());
                    }

                    enderecos.add(e);
                }
                usuario.setEnderecos(enderecos);
            }

            if (node.hasNonNull("cartoes")) {
                Set<Cartao> cartoes = new HashSet<>();
                for (JsonNode cartaoNode : node.get("cartoes")) {
                    Cartao c = new Cartao();
                    c.setGatewayToken(cartaoNode.get("gatewayToken").asText());
                    c.setUltimos4(cartaoNode.get("ultimos4").asText());
                    c.setBandeira(cartaoNode.get("bandeira").asText());
                    c.setMesExpiracao(cartaoNode.get("mesExpiracao").asInt());
                    c.setAnoExpiracao(cartaoNode.get("anoExpiracao").asInt());
                    c.setTitular(cartaoNode.get("titular").asText());
                    c.setAtivo(cartaoNode.get("ativo").asBoolean());
                    cartoes.add(c);
                }
                usuario.setCartoes(cartoes);
            }

            usuarioRepository.persist(usuario);
        }
    }
}