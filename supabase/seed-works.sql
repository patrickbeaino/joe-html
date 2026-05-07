with seed (
  title,
  type,
  director,
  vimeo_url,
  image_path,
  image_url,
  image_style,
  image_alt
) as (
  values
    ('I Don''t Know You', 'Teaser', 'Kentaro Sakaguchi', 'https://vimeo.com/1174435355', 'assets-2/catalog/i-don-t-know-you.webp', '/assets-2/catalog/i-don-t-know-you.webp', '', 'I Don''t Know You'),
    ('Brave Cat', 'Promoreel', 'Gabriel Osorio Vargas', 'https://vimeo.com/1173944474', 'assets-2/catalog/brave-cat.jpg', '/assets-2/catalog/brave-cat.jpg', '', 'Brave Cat'),
    ('All That''s Left of You', 'Trailer', 'Cherien Dabis', '', 'assets-2/catalog/all-that-s-left-of-you.webp', '/assets-2/catalog/all-that-s-left-of-you.webp', '', 'All That''s Left of You'),
    ('Mano Negra: Bring the Noise!', 'Teaser', 'David Dufresne', 'https://vimeo.com/1174438225', 'assets-2/catalog/mano-negra-bring-the-noise.webp', '/assets-2/catalog/mano-negra-bring-the-noise.webp', '', 'Mano Negra: Bring the Noise!'),
    ('We Believe You', 'Trailer', 'Charlotte Devillers & Arnaud Dufeys', '', 'assets-2/catalog/we-believe-you.webp', '/assets-2/catalog/we-believe-you.webp', '', 'We Believe You'),
    ('The Wonderers', 'Promoreel', 'Joséphine Japy', 'https://vimeo.com/1092046354', 'assets-2/catalog/the-wonderers.jpg', '/assets-2/catalog/the-wonderers.jpg', '', 'The Wonderers'),
    ('Growing Down', 'Promoreel', 'Dániel Bálint Sós', 'https://vimeo.com/1092052668', 'assets-2/catalog/growing-down.jpg', '/assets-2/catalog/growing-down.jpg', '', 'Growing Down'),
    ('Inside', 'Promoreel', 'Charles Williams', 'https://vimeo.com/933675685', 'assets-2/catalog/inside.jpg', '/assets-2/catalog/inside.jpg', '', 'Inside'),
    ('Une Vie Rêvée', 'Promoreel', 'Morgan Simon', 'https://vimeo.com/883967785', 'assets-2/catalog/une-vie-revee.jpg', '/assets-2/catalog/une-vie-revee.jpg', '', 'Une Vie Rêvée'),
    ('All Shall Be Well', 'Trailer', 'Ray Yeung', '', 'assets-2/catalog/all-shall-be-well.webp', '/assets-2/catalog/all-shall-be-well.webp', '', 'All Shall Be Well'),
    ('Silverstar', 'Promo', 'Ruben Amar', 'https://vimeo.com/933679158', 'assets-2/catalog/silverstar.webp', '/assets-2/catalog/silverstar.webp', '', 'Silverstar'),
    ('Morte Cucina', 'Promoreel', 'Pen-Ek Ratanaruang', 'https://vimeo.com/1092047126', 'assets-2/catalog/morte-cucina.jpg', '/assets-2/catalog/morte-cucina.jpg', '', 'Morte Cucina'),
    ('Lo Que Queda de Ti', 'Trailer', 'Gala Gracia', '', 'assets-2/catalog/lo-que-queda-de-ti.jpg', '/assets-2/catalog/lo-que-queda-de-ti.jpg', '', 'Lo Que Queda de Ti'),
    ('Fin de Fiesta', 'Promoreel', 'Elena Manrique', 'https://vimeo.com/933710406', 'assets-2/catalog/fin-de-fiesta.jpg', '/assets-2/catalog/fin-de-fiesta.jpg', '', 'Fin de Fiesta'),
    ('Calladita', 'Trailer', 'Miguel Faus', '', 'assets-2/catalog/calladita.jpg', '/assets-2/catalog/calladita.jpg', '', 'Calladita'),
    ('Heroico', 'Promoreel', 'David Zonana', 'https://vimeo.com/764180059', 'assets-2/catalog/heroico.jpg', '/assets-2/catalog/heroico.jpg', '', 'Heroico'),
    ('Some Rain Must Fall', 'Teaser', 'Wang Qiu', 'https://vimeo.com/883971552', 'assets-2/catalog/some-rain-must-fall.jpg', '/assets-2/catalog/some-rain-must-fall.jpg', '', 'Some Rain Must Fall'),
    ('Woman Of', 'Trailer', 'Małgorzata Szumowska & Michał Englert', '', 'assets-2/catalog/woman-of.jpg', '/assets-2/catalog/woman-of.jpg', '', 'Woman Of'),
    ('Stranizza d''Amuri', 'Promoreel', 'Giuseppe Fiorello', 'https://vimeo.com/772393932', 'assets-2/catalog/stranizza-d-amuri.png', '/assets-2/catalog/stranizza-d-amuri.png', '', 'Stranizza d''Amuri'),
    ('Fatum', 'Promoreel', 'Juan Galiñanes', 'https://vimeo.com/766887601', 'assets-2/catalog/fatum.jpg', '/assets-2/catalog/fatum.jpg', '', 'Fatum'),
    ('Madame Luna', 'Promoreel', 'Daniel Espinosa', 'https://vimeo.com/883972318', 'assets-2/catalog/madame-luna.jpg', '/assets-2/catalog/madame-luna.jpg', '', 'Madame Luna'),
    ('The Blue Caftan', 'Trailer', 'Maryam Touzani', '', 'assets-2/catalog/the-blue-caftan.jpg', '/assets-2/catalog/the-blue-caftan.jpg', '', 'The Blue Caftan'),
    ('Stella in Love', 'Promoreel', 'Sylvie Verheyde', 'https://vimeo.com/735911279', 'assets-2/catalog/stella-in-love.png', '/assets-2/catalog/stella-in-love.png', '', 'Stella in Love'),
    ('The Hole in the Fence', 'Promoreel', 'Joaquin del Paso', 'https://vimeo.com/735371013', 'assets-2/catalog/the-hole-in-the-fence.webp', '/assets-2/catalog/the-hole-in-the-fence.webp', '', 'The Hole in the Fence'),
    ('Tel Aviv-Beyrouth', 'Promoreel', 'Michale Boganim', 'https://vimeo.com/1180755254', 'assets-2/catalog/tel-aviv-beyrouth.jpg', '/assets-2/catalog/tel-aviv-beyrouth.jpg', '', 'Tel Aviv-Beyrouth'),
    ('Centauro', 'Trailer', 'Daniel Calparsoro', 'https://vimeo.com/735908744', 'assets-2/catalog/centauro.jpg', '/assets-2/catalog/centauro.jpg', '', 'Centauro'),
    ('Nous', 'Trailer', 'Alice Diop', 'https://vimeo.com/1180753554', 'assets-2/catalog/nous.jpg', '/assets-2/catalog/nous.jpg', '', 'Nous'),
    ('Gaza Mon Amour', 'Promoreel', 'Arab & Tarzan Nasser', 'https://vimeo.com/735918777', 'assets-2/catalog/gaza-mon-amour.jpg', '/assets-2/catalog/gaza-mon-amour.jpg', '', 'Gaza Mon Amour')
),
numbered_seed as (
  select
    seed.*,
    (row_number() over ())::integer as sort_order
  from seed
),
updated as (
  update public.works as existing
  set
    type = numbered_seed.type,
    vimeo_url = numbered_seed.vimeo_url,
    image_path = numbered_seed.image_path,
    image_url = numbered_seed.image_url,
    image_style = numbered_seed.image_style,
    image_alt = numbered_seed.image_alt,
    sort_order = numbered_seed.sort_order
  from numbered_seed
  where existing.title = numbered_seed.title
    and existing.director = numbered_seed.director
  returning existing.title, existing.director
)
insert into public.works (
  title,
  type,
  director,
  vimeo_url,
  image_path,
  image_url,
  image_style,
  image_alt,
  sort_order
)
select
  numbered_seed.title,
  numbered_seed.type,
  numbered_seed.director,
  numbered_seed.vimeo_url,
  numbered_seed.image_path,
  numbered_seed.image_url,
  numbered_seed.image_style,
  numbered_seed.image_alt,
  numbered_seed.sort_order
from numbered_seed
where not exists (
  select 1
  from public.works existing
  where existing.title = numbered_seed.title
    and existing.director = numbered_seed.director
);
