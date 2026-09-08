package mg.cecam.bic.client;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByIdentifiants_NumeroAndIdentifiants_TypeIdentifiant(String numero, String typeIdentifiant);
}