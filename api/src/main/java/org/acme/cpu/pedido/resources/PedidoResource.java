package org.acme.cpu.pedido.resources;

import io.quarkus.security.Authenticated;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.acme.cpu.pedido.dtos.Pedido.PedidoDTO;
import org.acme.cpu.pedido.services.PedidoServiceImpl;
import org.eclipse.microprofile.jwt.JsonWebToken;

@ApplicationScoped
@Path("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class PedidoResource {

    @Inject
    PedidoServiceImpl service;

    @Inject
    JsonWebToken jwt;

    @Inject
    UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado() {
        String login = jwt.getName();
        Usuario usuario = usuarioRepository.findByLogin(login);
        if (usuario == null) {
            throw new NotFoundException("Usuário autenticado não encontrado no banco de dados.");
        }
        return usuario;
    }

    @POST
    public Response criar(@Valid PedidoDTO dto) {
        return Response.status(Response.Status.CREATED)
                .entity(service.realizarPedido(getUsuarioAutenticado(), dto))
                .build();
    }

    @GET
    public Response listar() {
        return Response.ok(service.listar(getUsuarioAutenticado())).build();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        return Response.ok(service.getPedido(getUsuarioAutenticado(), id)).build();
    }

    @PATCH
    @Path("/{id}/cancelar")
    public Response cancelar(@PathParam("id") Long id) {
        return Response.ok(service.cancelarPedido(id, getUsuarioAutenticado())).build();
    }
}