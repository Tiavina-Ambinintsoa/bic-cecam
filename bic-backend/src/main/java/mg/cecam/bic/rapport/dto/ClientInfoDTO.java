// ClientInfoDTO.java
package mg.cecam.bic.rapport.dto;

import java.time.LocalDate;

public record ClientInfoDTO(
        String titre, String nomComplet, String prenom, String deuxiemePrenom, String nom,
        LocalDate dateNaissance, String villeNaissance, String paysNaissance,
        String genre, String nationalite, String etatCivil, String categorieTiersCode
) {}