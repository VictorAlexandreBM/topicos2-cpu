package org.acme.cpu.pedido.resources;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.pedido.services.PedidoServiceImpl;

@ApplicationScoped
@Path("/webhooks/pix")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WebhookPixResource {

    @Inject
    PedidoServiceImpl service;

    @POST
    @Path("/{txid}/confirmar")
    public Response confirmarPagamento(@PathParam("txid") String txid) {
        service.confirmarPagamentoPix(txid);

        // Em webhooks, o padrão é retornar 200 OK genérico e sem payload,
        // apenas para notificar a origem de que o sinal foi processado com sucesso.
        return Response.ok().build();
    }
}