package org.acme.cpu.admin.resources;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.admin.dto.marca.MarcaDTO;
import org.acme.cpu.admin.services.marca.MarcaService;

import java.util.Map;

@ApplicationScoped
@Path("/marcas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Administrador")
public class MarcaResource {

    @Inject
    MarcaService service;

    @GET
    @PermitAll // Abre exceção apenas para a listagem (público)
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
    public Response inserir(@Valid MarcaDTO dto) {
        return Response.ok(service.criar(dto)).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, @Valid MarcaDTO dto) {
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
}