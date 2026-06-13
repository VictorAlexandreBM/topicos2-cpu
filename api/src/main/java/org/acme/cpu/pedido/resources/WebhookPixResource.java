package org.acme.cpu.pedido.resources;

import io.quarkus.security.Authenticated;
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
@Authenticated
public class WebhookPixResource {

    @Inject
    PedidoServiceImpl service;

    @POST
    @Path("/{txid}/confirmar")
    public Response confirmarPagamento(@PathParam("txid") String txid) {
        service.confirmarPagamentoPix(txid);

        return Response.ok().build();
    }
}