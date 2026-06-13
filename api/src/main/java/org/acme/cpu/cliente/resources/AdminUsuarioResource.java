package org.acme.cpu.cliente.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.cliente.services.usuario.UsuarioService;
import org.acme.cpu.pedido.dtos.Pedido.PedidoResponseDTO;
import org.acme.cpu.pedido.services.PedidoServiceImpl;
import org.jboss.resteasy.reactive.RestQuery;

@ApplicationScoped
@Path("/admin/usuarios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Administrador")
public class AdminUsuarioResource {

    @Inject
    UsuarioService service;

    @Inject
    PedidoServiceImpl pedidoService; // Injeção do serviço de pedidos

    @GET
    public Response listar(
            @RestQuery Integer pagina,
            @RestQuery Integer tamanho,
            @RestQuery String filtro,
            @RestQuery Boolean ativo,
            @RestQuery String campoOrdenacao,
            @RestQuery String direcao
    ) {
        return Response.ok(service.listarUsuarios(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao)).build();
    }

    @PATCH
    @Path("/{id}/status")
    public Response alterarStatus(@PathParam("id") Long id, @RestQuery boolean ativo) {
        service.alterarStatus(id, ativo);
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}/perfil")
    public Response alterarPerfil(@PathParam("id") Long id, @RestQuery char perfil) {
        service.alterarPerfil(id, perfil);
        return Response.noContent().build();
    }

    @GET
    @Path("/{id}/pedidos")
    public Response listarPedidosUsuario(@PathParam("id") Long id) {
        return Response.ok(pedidoService.listarPorUsuarioId(id)).build();
    }
}