package org.acme.cpu.pedido.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.pedido.dtos.cupom.CupomRequestDTO;
import org.acme.cpu.pedido.services.CupomServiceImpl;

import java.util.Map;

@ApplicationScoped
@Path("/cupons")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Administrador")
public class CupomResource {

    @Inject
    CupomServiceImpl service;

    @GET
    public Response listar() {
        return Response.ok(service.listar()).build();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        return Response.ok(service.getById(id)).build();
    }

    @POST
    public Response criar(@Valid CupomRequestDTO dto) {
        return Response.status(Response.Status.CREATED).entity(service.criar(dto)).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, @Valid CupomRequestDTO dto) {
        return Response.ok(service.atualizar(id, dto)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        service.deletar(id);
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}")
    public Response alterarEstado(@PathParam("id") Long id, Map<String, Boolean> updates) {
        if (updates.containsKey("ativo")) {
            service.alterarEstado(id, updates.get("ativo"));
        }
        return Response.noContent().build();
    }
}