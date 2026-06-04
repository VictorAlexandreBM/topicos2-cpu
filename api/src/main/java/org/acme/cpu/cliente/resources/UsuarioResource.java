package org.acme.cpu.cliente.resources;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.acme.cpu.cliente.dtos.usuario.*;
import org.acme.cpu.cliente.services.token.TokenService;
import org.acme.cpu.cliente.services.usuario.UsuarioService;

@ApplicationScoped
@Path("/usuarios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    @Inject
    UsuarioService service;

    @Inject
    TokenService tokenService;

    @POST
    @Path("/login")
    @PermitAll
    public Response login(UsuarioLoginDTO dto) {
        UsuarioLogadoResponseDTO authInfo = service.logar(dto);
        return Response.ok(authInfo).build();
    }


    @POST
    @Path("/refresh")
    @Authenticated
    public Response refresh(UsuarioLogadoDTO dto) {
        UsuarioLogadoResponseDTO authInfo = tokenService.validarRefreshToken(dto.refreshToken());
        return Response.ok(authInfo).build();
    }

    @POST
    @Path("/logout")
    @Authenticated
    public Response logout(UsuarioLogadoDTO dto) {
        tokenService.invalidarRefreshToken(dto.refreshToken());

        return Response.noContent().build();
    }

    @GET
    @Path("/eu")
    @Authenticated
    public Response eu(@Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();

        UsuarioResponseDTO usuario = service.findByLogin(email);

        return Response.ok(usuario).build();
    }

    @POST
    @PermitAll
    public Response cadastrar(@Valid UsuarioCadastroDTO dto) {
        return Response.status(Response.Status.CREATED).entity(service.cadastrar(dto)).build();
    }


    @PATCH
    @Path("/eu")
    public Response atualizar(UsuarioUpdateDTO dto) {

        return Response.ok(service.atualizar(dto)).build();
    }

}
