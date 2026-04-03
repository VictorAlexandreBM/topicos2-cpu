package org.acme.cpu.exception;

import io.quarkus.security.UnauthorizedException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.time.OffsetDateTime;

@Provider
@ApplicationScoped
public class UnauthorizedExceptionMapper implements ExceptionMapper<UnauthorizedException> {

    @ConfigProperty(name = "problem.base-url")
    String baseUrl;

    @Context
    UriInfo uriInfo;

    @Inject
    Logger LOG;

    @Override
    public Response toResponse(UnauthorizedException e) {
        var p = new Problem();
        p.type = baseUrl + "/errors/unauthorized";
        p.title = "É necessário estar autenticado para acessar este recurso.";
        p.status = Response.Status.UNAUTHORIZED.getStatusCode();
        p.detail = e.getMessage();
        p.instance = (uriInfo != null ? uriInfo.getRequestUri().getPath() : null);
        p.timestamp = OffsetDateTime.now();

        LOG.warnf("Unauthorized (401) na URL '%s': %s", p.instance, e.getMessage());

        return Response.status(p.status)
                .type("application/problem+json")
                .entity(p)
                .build();
    }
}
