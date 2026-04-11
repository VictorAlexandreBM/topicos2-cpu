package org.acme.cpu.dto.modeloCpu;

import org.acme.cpu.dto.chipset.ChipsetResponseDTO;
import org.acme.cpu.dto.marca.MarcaResponseDTO;
import org.acme.cpu.dto.socket.SocketResponseDTO;
import org.acme.cpu.dto.tecnologia.TecnologiaResponseDTO;

import java.util.List;

public record ModeloCpuOpcoesForm(
        List<MarcaResponseDTO> marcas,
        List<SocketResponseDTO> sockets,
        List<ChipsetResponseDTO> chipsets,
        List<TecnologiaResponseDTO> tecnologias
) {}