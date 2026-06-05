package org.acme.cpu.cliente.resources;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.cliente.dtos.cartao.CartaoDTO;
import org.acme.cpu.cliente.services.cartao.CartaoService;

@Path("/cartoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class CartaoResource {

    @Inject
    CartaoService service;

    @GET
    public Response listar() {
        return Response.ok(service.listar()).build();
    }

    @POST
    public Response criar(@Valid CartaoDTO dto) {
        return Response.status(Response.Status.CREATED).entity(service.criar(dto)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        service.deletar(id);
        return Response.noContent().build();
    }
}