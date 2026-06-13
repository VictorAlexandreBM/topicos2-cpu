package org.acme.cpu.pedido.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.pedido.models.enums.StatusPedido;
import org.acme.cpu.pedido.services.PedidoServiceImpl;
import org.jboss.resteasy.reactive.RestQuery;

import java.time.LocalDate;

@ApplicationScoped
@Path("/admin/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Administrador")
public class PedidoAdminResource {

    @Inject
    PedidoServiceImpl service;

    @GET
    public Response listar(
            @RestQuery Integer pagina,
            @RestQuery Integer tamanho,
            @RestQuery String filtro,
            @RestQuery StatusPedido status,
            @RestQuery LocalDate dataInicio,
            @RestQuery LocalDate dataFim,
            @RestQuery String campoOrdenacao,
            @RestQuery String direcao
    ) {
        return Response.ok(service.listarAdmin(pagina, tamanho, filtro, status, dataInicio, dataFim, campoOrdenacao, direcao)).build();
    }

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

    @GET
    @Path("/{id}")
    public Response obterPorId(@PathParam("id") Long id) {
        return Response.ok(service.getPedidoAdmin(id)).build();
    }
}