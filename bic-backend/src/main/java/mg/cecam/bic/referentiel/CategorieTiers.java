package mg.cecam.bic.referentiel;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorie_tiers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CategorieTiers {

    @Id
    private String code;

    @Column(nullable = false)
    private String libelle;

    @Column(name = "code_parent")
    private String codeParent;
}