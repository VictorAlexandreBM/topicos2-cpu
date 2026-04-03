package org.acme.cpu.exception;

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
public class ValidationExceptionMapper implements ExceptionMapper<ValidationException> {
    @Context
    UriInfo uri;

    @ConfigProperty(name = "problem.base-url")
    String baseUrl;

    @Inject
    Logger LOG;

    @Override
    public Response toResponse(ValidationException e) {


        var p = new Problem();
        p.type = baseUrl + "/errors/validation-error";
        p.title = "Erro de validação";
        p.status = e.isConflito() ? Response.Status.CONFLICT.getStatusCode() :  Response.Status.BAD_REQUEST.getStatusCode();
        p.detail = e.getMessage();
        p.instance = (uri != null ? uri.getRequestUri().getPath() : null);
        p.timestamp = OffsetDateTime.now();
        p.errors = e.getFieldErrors();

        LOG.warnf("Erro de validação gerou BadRequest (400) na URL '%s': %s", p.instance, e.getMessage());

        return Response.status(p.status).type("application/problem+json").entity(p).build();

    }
}
