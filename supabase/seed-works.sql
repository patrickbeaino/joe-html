insert into public.works (
  title,
  type,
  director,
  vimeo_url,
  image_path,
  image_url,
  image_style,
  image_alt
)
select *
from (
  values
    ('I Don''t Know You', 'Teaser', 'Kentaro Sakaguchi', 'https://vimeo.com/1174435355', 'assets-2/brave-cat.jpg', '/assets-2/brave-cat.jpg', '', 'I Don''t Know You'),
    ('Brave Cat', 'Promoreel', 'Gabriel Osorio Vargas', 'https://vimeo.com/1173944474', 'assets-2/all-thats-left.jpg', '/assets-2/all-thats-left.jpg', '', 'Brave Cat'),
    ('All That''s Left of You', 'Trailer', 'Cherien Dabis', '', 'assets-2/bring-the-noise.jpg', '/assets-2/bring-the-noise.jpg', '', 'All That''s Left of You'),
    ('Mano Negra: Bring the Noise!', 'Teaser', 'David Dufresne', 'https://vimeo.com/1174438225', 'assets-2/manonegra.jpg', '/assets-2/manonegra.jpg', '', 'Mano Negra'),
    ('We Believe You', 'Trailer', 'Charlotte Devillers & Arnaud Dufeys', '', 'assets-2/we-believe-you.jpg', '/assets-2/we-believe-you.jpg', '', 'We Believe You'),
    ('The Wonderers', 'Promoreel', 'Joséphine Japy', 'https://vimeo.com/1092046354', 'assets-2/the-wonders.jpg', '/assets-2/the-wonders.jpg', '', 'The Wonderers'),
    ('Growing Down', 'Promoreel', 'Dániel Bálint Sós', 'https://vimeo.com/1092052668', 'assets-2/growing-down.jpg', '/assets-2/growing-down.jpg', '', 'Growing Down'),
    ('Inside', 'Promoreel', 'Charles Williams', 'https://vimeo.com/933675685', 'assets-2/inside.jpg', '/assets-2/inside.jpg', '', 'Inside'),
    ('Une Vie Rêvée', 'Promoreel', 'Morgan Simon', 'https://vimeo.com/883967785', 'assets-2/une-vie-revee.jpg', '/assets-2/une-vie-revee.jpg', '', 'Une Vie Rêvée'),
    ('All Shall Be Well', 'Trailer', 'Ray Yeung', '', 'assets-2/all-thats-left.jpg', '/assets-2/all-thats-left.jpg', '', 'All Shall Be Well'),
    ('Silverstar', 'Promo', 'Ruben Amar', 'https://vimeo.com/933679158', 'assets-2/silverstar.jpg', '/assets-2/silverstar.jpg', '', 'Silverstar'),
    ('Morte Cucina', 'Promoreel', 'Pen-Ek Ratanaruang', 'https://vimeo.com/1092047126', 'assets-2/morte-cucina.jpg', '/assets-2/morte-cucina.jpg', '', 'Morte Cucina'),
    ('Lo Que Queda de Ti', 'Trailer', 'Gala Gracia', '', 'assets-2/lo-que-queda-de-ti.jpg', '/assets-2/lo-que-queda-de-ti.jpg', '', 'Lo Que Queda de Ti'),
    ('Fin de Fiesta', 'Promoreel', 'Elena Manrique', 'https://vimeo.com/933710406', 'assets-2/fin.jpg', '/assets-2/fin.jpg', '', 'Fin de Fiesta'),
    ('Calladita', 'Trailer', 'Miguel Faus', '', 'assets-2/caladita.jpg', '/assets-2/caladita.jpg', '', 'Calladita'),
    ('Heroico', 'Promoreel', 'David Zonana', 'https://vimeo.com/764180059', 'assets-2/heroico.jpg', '/assets-2/heroico.jpg', '', 'Heroico'),
    ('Some Rain Must Fall', 'Teaser', 'Wang Qiu', 'https://vimeo.com/883971552', 'assets/PHOTO-2026-04-19-21-58-24 6.jpg', '/assets/PHOTO-2026-04-19-21-58-24 6.jpg', '', 'Some Rain Must Fall'),
    ('Woman Of', 'Trailer', 'Małgorzata Szumowska & Michał Englert', '', 'assets-2/woman-off.jpg', '/assets-2/woman-off.jpg', '', 'Woman Of'),
    ('Stranizza d''Amuri', 'Promoreel', 'Giuseppe Fiorello', 'https://vimeo.com/772393932', 'assets-2/stramiza.jpg', '/assets-2/stramiza.jpg', '', 'Stranizza d''Amuri'),
    ('Fatum', 'Promoreel', 'Juan Galiñanes', 'https://vimeo.com/766887601', 'assets-2/fatum.jpg', '/assets-2/fatum.jpg', '', 'Fatum'),
    ('Madame Luna', 'Promoreel', 'Daniel Espinosa', 'https://vimeo.com/883972318', 'assets-2/luna.jpg', '/assets-2/luna.jpg', '', 'Madame Luna'),
    ('The Blue Caftan', 'Trailer', 'Maryam Touzani', '', 'assets-2/blue-caften.jpg', '/assets-2/blue-caften.jpg', '', 'The Blue Caftan'),
    ('Stella in Love', 'Promoreel', 'Sylvie Verheyde', 'https://vimeo.com/735911279', 'assets-2/stella-in-love.jpg', '/assets-2/stella-in-love.jpg', '', 'Stella in Love'),
    ('The Hole in the Fence', 'Promoreel', 'Joaquin del Paso', 'https://vimeo.com/735371013', 'assets-2/the-whole.jpg', '/assets-2/the-whole.jpg', '', 'The Hole in the Fence'),
    ('Tel Aviv-Beyrouth', 'Promoreel', 'Michale Boganim', 'https://vimeo.com/1180755254', 'assets-2/tel-aviv.jpg', '/assets-2/tel-aviv.jpg', '', 'Tel Aviv-Beyrouth'),
    ('Centauro', 'Trailer', 'Daniel Calparsoro', 'https://vimeo.com/735908744', 'assets-2/centauro.jpg', '/assets-2/centauro.jpg', '', 'Centauro'),
    ('Nous', 'Trailer', 'Alice Diop', 'https://vimeo.com/1180753554', 'assets-2/nous.jpg', '/assets-2/nous.jpg', '', 'Nous'),
    ('Gaza Mon Amour', 'Promoreel', 'Arab & Tarzan Nasser', 'https://vimeo.com/735918777', 'assets-2/gaza.jpg', '/assets-2/gaza.jpg', 'filter:grayscale(40%)', 'Gaza Mon Amour')
) as seed (
  title,
  type,
  director,
  vimeo_url,
  image_path,
  image_url,
  image_style,
  image_alt
)
where not exists (
  select 1
  from public.works existing
  where existing.title = seed.title
    and existing.director = seed.director
);
