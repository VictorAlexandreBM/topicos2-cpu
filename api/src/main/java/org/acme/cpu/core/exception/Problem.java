package org.acme.cpu.core.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;
import java.util.List;

//RFC 7807 - https://datatracker.ietf.org/doc/html/rfc7807
//RFC 9457 - https://datatracker.ietf.org/doc/rfc9457/

@JsonInclude(JsonInclude.Include.NON_NULL)
public final class Problem {
    public String type;
    public String title;
    public Integer status;
    public String detail;
    public String instance;
    public OffsetDateTime timestamp;
    public String traceId;
    public List<FieldError> errors;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static final class FieldError {
        public final String field;
        public final String message;

        public FieldError(String field, String message) {
            this.field = field;
            this.message = message;
        }
    }
}