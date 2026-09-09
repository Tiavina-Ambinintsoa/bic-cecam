package mg.cecam.bic.contrat;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EcheanceRepository extends JpaRepository<Echeance, Long> {
    List<Echeance> findByContrat_IdOrderByNumeroEcheance(Long contratId);
}