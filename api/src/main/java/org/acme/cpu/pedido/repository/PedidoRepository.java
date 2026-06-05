package org.acme.cpu.pedido.repository;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.pedido.models.Pedido;

import java.util.List;

@ApplicationScoped
public class PedidoRepository implements PanacheRepository<Pedido> {

    public List<Pedido> findByUsuario(Usuario usuario) {
        return find("usuario", usuario).list();
    }

    public PanacheQuery<Pedido> findBytxid(String txid) {

        return find("SELECT p FROM Pedido p, PagamentoPix pix WHERE p.pagamento = pix AND pix.txid = ?1", txid);
    }
}
