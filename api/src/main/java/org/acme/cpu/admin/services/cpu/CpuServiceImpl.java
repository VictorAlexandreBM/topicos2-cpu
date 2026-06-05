package org.acme.cpu.admin.services.cpu;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.core.clients.SeaweedFsClient;
import org.acme.cpu.admin.dto.cpu.*;
import org.acme.cpu.admin.models.Cpu;
import org.acme.cpu.admin.models.CpuBox;
import org.acme.cpu.admin.models.CpuTray;
import org.acme.cpu.admin.models.ModeloCpu;
import org.acme.cpu.core.dtos.ArquivoUploadFormDTO;
import org.acme.cpu.core.dtos.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.core.exception.ValidationException;
import org.acme.cpu.admin.repositories.CpuRepository;
import org.acme.cpu.admin.repositories.ModeloCpuRepository;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CpuServiceImpl implements CpuService {

    @Inject
    CpuRepository repository;

    @Inject
    ModeloCpuRepository modeloCpuRepository;

    @Inject
    @RestClient
    SeaweedFsClient seaweedFsClient;

    @Inject
    SecurityIdentity securityIdentity;

    private static final long MAX_TAMANHO_ARQUIVO = 5 * 1024 * 1024; // 5MB em bytes
    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/webp");

    @Override
    public RespostaPaginadaDTO<CpuListDTO> listar(Integer pagina, Integer tamanho, CpuFilterDTO filtro, String campoOrdenacao, String direcao) {
        // Agora repassa o objeto DTO de filtro para o repositório

        if (!securityIdentity.hasRole("Administrador")) {
            filtro = filtro.withEmVenda(true);
        }

        List<CpuListDTO> listaCpus = repository.listarResumido(pagina, tamanho, filtro, campoOrdenacao, direcao);
        Long quantidade = repository.countListar(filtro);

        return new RespostaPaginadaDTO<>(listaCpus, quantidade);
    }

    @Override
    @Transactional
    public CpuDetailDTO criar(CpuRequestDTO dto) {
        validarSkuUnico(dto.sku(), null);

        Cpu cpu = instanciarPeloTipo(dto);
        aplicarDtoNoModelo(cpu, dto);
        cpu.setDataInclusao(LocalDate.now());

        repository.persist(cpu);
        return mapToDetailDto(cpu);
    }

    @Override
    public CpuDetailDTO get(Long id) {

        Cpu cpu = repository.findByIdWithDetails(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");
        if (securityIdentity.hasRole("Administrador") && !cpu.isEmVenda()) {
            throw new NotFoundException("CPU não encontrada");
        }
        return mapToDetailDto(cpu);
    }

    @Override
    @Transactional
    public void atualizar(Long id, CpuRequestDTO dto) {
        Cpu cpu = repository.findById(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");

        validarSkuUnico(dto.sku(), id);

        validarMudancaDeTipo(cpu, dto);

        aplicarDtoNoModelo(cpu, dto);
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Cpu cpu = repository.findById(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");

        // Extrai o nome do arquivo da URL para excluir no SeaweedFS
        if (cpu.getImagemUrl() != null && cpu.getImagemUrl().contains("/cpus/")) {
            String nomeArquivo = cpu.getImagemUrl().substring(cpu.getImagemUrl().lastIndexOf("/") + 1);
            try {
                seaweedFsClient.deletarArquivo("cpus", nomeArquivo);
            } catch (Exception e) {
                // Apenas loga o erro, não impede a exclusão no banco se o Filer estiver fora do ar
                System.err.println("Aviso: Falha ao excluir arquivo físico no SeaweedFS: " + nomeArquivo);
            }
        }

        repository.delete(cpu);
    }

    @Override
    @Transactional
    public void alterarEstadoVenda(Long id, Boolean estado) {
        Cpu cpu = repository.findById(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");
        cpu.setEmVenda(estado);
    }


    private void validarSkuUnico(String sku, Long idAtual) {
        Cpu existente = repository.find("sku", sku).firstResult();
        if (existente != null && !existente.getId().equals(idAtual)) {
            throw ValidationException.of("sku", "Já existe uma CPU cadastrada com este SKU.");
        }
    }

    private void validarMudancaDeTipo(Cpu entidade, CpuRequestDTO dto) {
        if ((entidade instanceof CpuBox && !(dto instanceof CpuBoxRequestDTO)) ||
                (entidade instanceof CpuTray && !(dto instanceof CpuTrayRequestDTO))) {
            throw ValidationException.of("tipo", "Não é permitido alterar o tipo da CPU (BOX/TRAY) após o cadastro.");
        }
    }

    private Cpu instanciarPeloTipo(CpuRequestDTO dto) {
        if (dto instanceof CpuBoxRequestDTO) return new CpuBox();
        if (dto instanceof CpuTrayRequestDTO) return new CpuTray();
        throw new IllegalArgumentException("Tipo de DTO inválido");
    }

    private void aplicarDtoNoModelo(Cpu cpu, CpuRequestDTO dto) {
        cpu.setSku(dto.sku());
        cpu.setPreco(dto.preco());
        cpu.setEstoque(dto.estoque());
        cpu.setEmVenda(dto.emVenda());
        cpu.setNomeComercial(dto.nomeComercial());

        ModeloCpu modelo = modeloCpuRepository.findById(dto.modeloId());
        if (modelo == null) throw ValidationException.of("modeloId", "Modelo de CPU não encontrado");
        cpu.setModelo(modelo);

        if (cpu instanceof CpuBox box && dto instanceof CpuBoxRequestDTO boxDto) {
            box.setIncluiCooler(boxDto.incluiCooler());
            box.setPesoEmbalagemGramas(boxDto.pesoEmbalagemGramas());
        } else if (cpu instanceof CpuTray tray && dto instanceof CpuTrayRequestDTO trayDto) {
            tray.setLoteFabricacao(trayDto.loteFabricacao());
        }
    }

    private CpuDetailDTO mapToDetailDto(Cpu cpu) {
        if (cpu instanceof CpuBox b) return new CpuBoxDetailDTO(b);
        if (cpu instanceof CpuTray t) return new CpuTrayDetailDTO(t);
        return null;
    }

    @Override
    @Transactional
    public void salvarImagem(Long id, ArquivoUploadFormDTO dto) {
        Cpu cpu = repository.findById(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");

        if (dto == null || dto.arquivo == null) {
            throw ValidationException.of("arquivo", "O arquivo de imagem é obrigatório.");
        }

        // 1. Validação de Tamanho
        if (dto.arquivo.size() > MAX_TAMANHO_ARQUIVO) {
            throw ValidationException.of("arquivo", "O arquivo excede o limite máximo permitido de 5MB.");
        }

        // 2. Validação de Formato (MIME Type)
        String mimeType = dto.arquivo.contentType();
        if (!TIPOS_PERMITIDOS.contains(mimeType)) {
            throw ValidationException.of("arquivo", "Formato inválido. Apenas imagens JPG, PNG e WEBP são permitidas.");
        }

        // 3. Processamento e Envio
        String extensao = obterExtensao(dto.arquivo.fileName());
        String nomeArquivoGerado = "cpu-" + id + "-" + UUID.randomUUID().toString().substring(0, 8) + extensao;

        try (Response response = seaweedFsClient.enviarArquivo("cpus", nomeArquivoGerado, dto.arquivo.uploadedFile().toFile())) {
            if (response.getStatus() >= 400) {
                throw new RuntimeException("Falha ao salvar a imagem no servidor de arquivos. HTTP Status: " + response.getStatus());
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro de comunicação com o servidor SeaweedFS.", e);
        }

        // 4. Atualização do Banco
        String urlAcesso = "http://localhost:8888/cpus/" + nomeArquivoGerado;
        cpu.setImagemUrl(urlAcesso);
    }

    private String obterExtensao(String nomeOriginal) {
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            return nomeOriginal.substring(nomeOriginal.lastIndexOf(".")).toLowerCase();
        }
        return ".jpg";
    }


}