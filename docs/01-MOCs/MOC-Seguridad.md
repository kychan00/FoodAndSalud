---
tipo: moc
estado: activo
---

# MOC — Seguridad

## Principios

- RLS habilitado en todas las tablas privadas.
- Cada registro pertenece a un usuario.
- `auth.uid()` limita acceso.
- Nunca exponer `service_role`.
- Nunca almacenar secretos en Git.
- El cliente web solo utiliza credenciales públicas.
- La seguridad no depende de ocultar la clave pública.
- Los permisos se validan en PostgreSQL.

## Regla central

Un usuario no debe poder:

- consultar datos de otro usuario
- modificar datos de otro usuario
- eliminar datos de otro usuario
- insertar registros atribuidos a otro usuario
