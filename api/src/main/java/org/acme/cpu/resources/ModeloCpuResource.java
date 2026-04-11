package org.acme.cpu.resources;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.dto.modeloCpu.ModeloCpuRequestDTO;
import org.acme.cpu.services.modeloCpu.ModeloCpuService;

import java.util.Map;

@ApplicationScoped
@Path("/modelos-cpu")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModeloCpuResource {

    @Inject
    ModeloCpuService service;

    @GET
    public Response listar(
            @QueryParam("pagina") Integer pagina,
            @QueryParam("tamanho") Integer tamanho,
            @QueryParam("filtro") String filtro,
            @QueryParam("ativo") Boolean ativo,
            @QueryParam("campoOrdenacao") String campoOrdenacao,
            @QueryParam("direcao") String direcao
    ) {
        return Response.ok(service.listar(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao)).build();
    }

    @POST
    public Response inserir(@Valid ModeloCpuRequestDTO dto) {
        return Response.ok(service.criar(dto)).build();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        return Response.ok(service.get(id)).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, @Valid ModeloCpuRequestDTO dto) {
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
        if (updates.containsKey("ativo")){
            service.alterarEstado(id, (Boolean) updates.get("ativo"));
        }
        return Response.noContent().build();
    }

    @GET
    @Path("/opcoes-form")
    public Response getOpcoesForm() {
        return Response.ok(service.getOpcoesForm()).build();
    }
}