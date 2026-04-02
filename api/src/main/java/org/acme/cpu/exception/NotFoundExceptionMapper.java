package org.acme.cpu.exception;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
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
public class NotFoundExceptionMapper implements ExceptionMapper<NotFoundException> {

    @ConfigProperty(name = "problem.base-url")
    String baseUrl;

    @Context
    UriInfo uriInfo;

    @Inject
    Logger LOG;

    @Override
    public Response toResponse(NotFoundException e) {
        var p = new Problem();
        p.type = baseUrl + "/errors/not-found";
        p.title = "Recurso não encontrado";
        p.status = Response.Status.NOT_FOUND.getStatusCode();
        p.detail = e.getMessage();
        p.instance = (uriInfo != null ? uriInfo.getRequestUri().getPath() : null);
        p.timestamp = OffsetDateTime.now();

        LOG.warnf("Not Found (404) na URL '%s': %s", p.instance, e.getMessage());

        return Response.status(p.status)
                .type("application/problem+json")
                .entity(p)
                .build();
    }
}
