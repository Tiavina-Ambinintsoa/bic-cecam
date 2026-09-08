INSERT INTO grille_score (intervalle, score_min, score_max, categorie_risque, couleur) VALUES
('A', 580, 850, 'Risque très faible', 'Vert sombre'),
('B', 500, 579, 'Risque faible', 'Vert clair'),
('C', 460, 499, 'Risque moyen', 'Jaune'),
('D', 400, 459, 'Risque élevé', 'Rouge verdâtre'),
('E', 300, 399, 'Risque très élevé', 'Rouge')
ON CONFLICT (intervalle) DO NOTHING;