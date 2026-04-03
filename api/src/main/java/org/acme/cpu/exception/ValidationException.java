package org.acme.cpu.exception;

import java.util.List;

public class ValidationException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private final List<Problem.FieldError> fieldErrors;
    private final Boolean conflito;

    public ValidationException(String msg, List<Problem.FieldError> errors, Boolean conflito) {
        super(msg);
        this.fieldErrors = (errors == null) ? List.of() : List.copyOf(errors);
        this.conflito = conflito;
    }

    public static ValidationException of(String field, String msg) {
        return new ValidationException("Dados inválidos", List.of(new Problem.FieldError(field, msg)), false);
    }

    public static ValidationException ofConflito(String field, String msg) {
        return new ValidationException("Dados inválidos", List.of(new Problem.FieldError(field, msg)), true);
    }

    public List<Problem.FieldError> getFieldErrors() {
        return fieldErrors;
    }

    public Boolean isConflito() {
        return this.conflito;
    }
}
