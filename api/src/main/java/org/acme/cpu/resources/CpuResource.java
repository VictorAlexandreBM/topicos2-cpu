package org.acme.cpu.resources;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.dto.cpu.CpuRequestDTO;
import org.acme.cpu.services.cpu.CpuService;

import java.util.Map;

@ApplicationScoped
@Path("/cpus")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CpuResource {

    @Inject
    CpuService service;

    @GET
    public Response listar(
            @QueryParam("pagina") Integer pagina,
            @QueryParam("tamanho") Integer tamanho,
            @QueryParam("filtro") String filtro,
            @QueryParam("emVenda") Boolean emVenda,
            @QueryParam("campoOrdenacao") String campoOrdenacao,
            @QueryParam("direcao") String direcao
    ) {
        return Response.ok(service.listar(pagina, tamanho, filtro, emVenda, campoOrdenacao, direcao)).build();
    }

    @POST
    public Response inserir(@Valid CpuRequestDTO dto) {
        return Response.status(Response.Status.CREATED).entity(service.criar(dto)).build();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        return Response.ok(service.get(id)).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, @Valid CpuRequestDTO dto) {
        service.atualizar(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        service.deletar(id);
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}")
    public Response patch(@PathParam("id") Long id, Map<String, Object> updates) {
        if (updates.containsKey("emVenda")) {
            service.alterarEstadoVenda(id, (Boolean) updates.get("emVenda"));
        }
        return Response.noContent().build();
    }
}