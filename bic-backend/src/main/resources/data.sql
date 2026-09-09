INSERT INTO grille_score (intervalle, score_min, score_max, categorie_risque, couleur) VALUES
('A', 580, 850, 'Risque très faible', 'Vert sombre'),
('B', 500, 579, 'Risque faible', 'Vert clair'),
('C', 460, 499, 'Risque moyen', 'Jaune'),
('D', 400, 459, 'Risque élevé', 'Rouge verdâtre'),
('E', 300, 399, 'Risque très élevé', 'Rouge')
ON CONFLICT (intervalle) DO NOTHING;

INSERT INTO client (id, code_client_cb, titre, categorie_tiers_code, prenom, nom, date_naissance,
                     ville_naissance, pays_naissance, genre, nationalite, etat_civil, date_derniere_modification)
VALUES (9001, 'L00190001', 'Mme', '0215', 'Hanta', 'Rakoto', '1985-04-12',
        'Antananarivo', 'Madagascar', 'FEMME', 'Malgache', 'Mariée', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO adresse (id, client_id, type_adresse, adresse_complete, numero_rue, code_postal, ville, commune, region, pays, actuelle, date_derniere_modification)
VALUES (9001, 9001, 'Individu - Adresse principale', 'Lot II M 45 Ankorondrano', '45', '101', 'Antananarivo', 'Antananarivo I', 'Analamanga', 'Madagascar', true, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO identifiant (id, client_id, type_identifiant, numero)
VALUES (9001, 9001, 'CIN', '301021985001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contrat (id, code_contrat_cb, client_id, mode_rattachement, type_contrat, role_client,
                      date_demande, montant_finance, montant_echeance_mensuelle, nombre_total_echeances,
                      devise, periodicite_paiement, phase_demande, date_derniere_modification)
VALUES (9001, '600900001', 9001, 'NOUVELLE_DEMANDE', 'Prêt personnel', 'TITULAIRE',
        '2024-01-15', 1200000, 100000, 12, 'Ariary malgache', 'Mensuelle', 'FERME', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO echeance (id, contrat_id, numero_echeance, date_echeance, montant_du, montant_paye, date_paiement, statut) VALUES
(90011, 9001, 1, '2024-02-15', 100000, 100000, '2024-02-14', 'PAYE_A_TEMPS'),
(90012, 9001, 2, '2024-03-15', 100000, 100000, '2024-03-15', 'PAYE_A_TEMPS'),
(90013, 9001, 3, '2024-04-15', 100000, 100000, '2024-04-20', 'EN_RETARD'),
(90014, 9001, 4, '2024-05-15', 100000, 100000, '2024-05-15', 'PAYE_A_TEMPS'),
(90015, 9001, 5, '2024-06-15', 100000, 100000, '2024-06-13', 'PAYE_A_TEMPS'),
(90016, 9001, 6, '2024-07-15', 100000, NULL, NULL, 'IMPAYE'),
(90017, 9001, 7, '2024-08-15', 100000, 100000, '2024-08-16', 'EN_RETARD'),
(90018, 9001, 8, '2024-09-15', 100000, 100000, '2024-09-15', 'PAYE_A_TEMPS'),
(90019, 9001, 9, '2024-10-15', 100000, 100000, '2024-10-15', 'PAYE_A_TEMPS'),
(90020, 9001, 10, '2024-11-15', 100000, 100000, '2024-11-14', 'PAYE_A_TEMPS'),
(90021, 9001, 11, '2024-12-15', 100000, 100000, '2024-12-15', 'PAYE_A_TEMPS'),
(90022, 9001, 12, '2025-01-15', 100000, 100000, '2025-01-15', 'PAYE_A_TEMPS')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contrat (id, code_contrat_cb, client_id, mode_rattachement, type_contrat, role_client,
                      date_demande, montant_finance, montant_echeance_mensuelle, nombre_total_echeances,
                      devise, periodicite_paiement, phase_demande, date_derniere_modification)
VALUES (9002, '600900002', 9001, 'NOUVELLE_DEMANDE', 'Prêt personnel', 'TITULAIRE',
        '2026-03-01', 800000, 100000, 8, 'Ariary malgache', 'Mensuelle', 'ACTIF', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO echeance (id, contrat_id, numero_echeance, date_echeance, montant_du, montant_paye, date_paiement, statut) VALUES
(90031, 9002, 1, '2026-04-01', 100000, 100000, '2026-04-01', 'PAYE_A_TEMPS'),
(90032, 9002, 2, '2026-05-01', 100000, 100000, '2026-05-03', 'EN_RETARD'),
(90033, 9002, 3, '2026-06-01', 100000, 100000, '2026-06-01', 'PAYE_A_TEMPS'),
(90034, 9002, 4, '2026-07-01', 100000, 100000, '2026-07-01', 'PAYE_A_TEMPS'),
(90035, 9002, 5, '2026-08-01', 100000, 100000, '2026-08-02', 'EN_RETARD'),
(90036, 9002, 6, '2026-09-01', 100000, NULL, NULL, 'A_VENIR'),
(90037, 9002, 7, '2026-10-01', 100000, NULL, NULL, 'A_VENIR'),
(90038, 9002, 8, '2026-11-01', 100000, NULL, NULL, 'A_VENIR')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('client', 'id'), (SELECT MAX(id) FROM client));
SELECT setval(pg_get_serial_sequence('adresse', 'id'), (SELECT MAX(id) FROM adresse));
SELECT setval(pg_get_serial_sequence('identifiant', 'id'), (SELECT MAX(id) FROM identifiant));
SELECT setval(pg_get_serial_sequence('contrat', 'id'), (SELECT MAX(id) FROM contrat));
SELECT setval(pg_get_serial_sequence('echeance', 'id'), (SELECT MAX(id) FROM echeance));