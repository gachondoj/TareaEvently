# Tarea Evently Software Engineer

## Como correr

1. Instalar dependencias
````
npm install
````

2. Crear el archivo .env y agregar la URL de la base de datos
```
DATABASE_URL="postgresql://[USER]:[PASSWORD]@localhost:5432/[NOMBRE_DB]?schema=public"
```

3. Correr las migraciones
```
npx prisma migrate dev --name init
```

4. Correr el servidor
```
npm run dev
```

## Suposiciones

1. TurboPack: A la hora de crear el proyecto se elegió TurboPack en lugar de WebPack ya que es más rápido y al estar haciendo un proyecto de prueba no hay riesgos de usar una tecnología en desarrollo
2. Eventos: La página de eventos solo muestra aquellos que tengan cupos y cuya fecha de realización sera posterior a la fecha actual