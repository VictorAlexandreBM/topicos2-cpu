package org.acme.cpu.core.dtos;

import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

public class ArquivoUploadFormDTO {

    @RestForm("file")
    public FileUpload arquivo;

}