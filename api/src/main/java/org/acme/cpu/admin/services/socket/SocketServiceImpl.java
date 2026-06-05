package org.acme.cpu.admin.services.socket;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.admin.dto.socket.SocketDTO;
import org.acme.cpu.admin.dto.socket.SocketResponseDTO;
import org.acme.cpu.core.dtos.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.core.exception.ValidationException;
import org.acme.cpu.admin.models.Socket;
import org.acme.cpu.admin.repositories.SocketRepository;

import java.util.List;

@ApplicationScoped
public class SocketServiceImpl implements SocketService {

    @Inject
    SocketRepository repository;

    @Inject
    SecurityIdentity securityIdentity;

    private Socket getSocketEntity(Long id) {
        Socket socket = repository.findById(id);

        if (socket == null || (!socket.isAtivo() && !securityIdentity.hasRole("Administrador"))) {
            throw new NotFoundException("Socket não encontrado");
        }

        return socket;
    }

    @Override
    public RespostaPaginadaDTO<SocketResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {

        if (!securityIdentity.hasRole("Administrador")) {
            ativo = true;
        }

        List<SocketResponseDTO> dados = repository.listar(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao)
                .stream()
                .map(SocketResponseDTO::new)
                .toList();

        long total = repository.countListar(filtro, ativo);

        return new RespostaPaginadaDTO<>(dados, total);
    }

    @Override
    public SocketResponseDTO getById(Long id) {
        return new SocketResponseDTO(getSocketEntity(id));
    }

    @Override
    @Transactional
    public Socket criar(SocketDTO t) {
        Socket socket = new Socket();

        if (repository.buscarAtivaPorTipo(t.tipo()) != null) {
            throw ValidationException.ofConflito("tipo", "Um socket com este tipo já existe!");
        }

        socket.setTipo(t.tipo());

        repository.persist(socket);

        return socket;
    }

    @Override
    @Transactional
    public void atualizar(Long id, SocketDTO t) {

        Socket socket = getSocketEntity(id);

        if (!socket.getTipo().equals(t.tipo()) && repository.buscarAtivaPorTipo(t.tipo()) != null) {
            throw ValidationException.ofConflito("tipo", "Um socket com este tipo já existe!");
        }

        socket.setTipo(t.tipo());
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Socket socket = getSocketEntity(id);

        repository.delete(socket);
    }

    @Override
    @Transactional
    public void alterarEstado(Long id, Boolean estado) {
        Socket socket = getSocketEntity(id);

        socket.setAtivo(estado);
    }
}