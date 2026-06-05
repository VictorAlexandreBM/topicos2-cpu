package org.acme.cpu.pedido.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.pedido.services.PedidoServiceImpl;

@ApplicationScoped
@Path("/admin/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Administrador")
public class PedidoAdminResource {

    @Inject
    PedidoServiceImpl service;

    @PATCH
    @Path("/{id}/enviar")
    public Response marcarComoEnviado(@PathParam("id") Long id) {
        return Response.ok(service.marcarComoEnviado(id)).build();
    }

    @PATCH
    @Path("/{id}/entregar")
    public Response marcarComoEntregue(@PathParam("id") Long id) {
        return Response.ok(service.marcarComoEntregue(id)).build();
    }
}