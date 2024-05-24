# API de FutPlanner

![FutPlanner Hero](hero.png)

La API de FutPlanner es una API diseñada para implementarse en el entorno de la aplicación del proyecto FutPlanner.

El proyecto FutPlanner tiene como objetivo 'democratizar' los datos de los jugadores de fútbol, brindando al entrenador la capacidad de almacenar datos sobre el rendimiento de sus jugadores y ver un resumen del rendimiento del equipo.

Este documento proporciona información sobre cómo interactuar con la API para realizar varias operaciones.

[Mas informacion sobre los metodos en ingles](README.MD)

### Versión 1.2.0

## Tabla de Contenidos
- [Primeros Pasos](#primeros-pasos)
- [Instalación](#instalación)

## Primeros Pasos

### URL Base
Todas las solicitudes a la API se realizan a la siguiente URL base:
`localhost:8080`

## Instalación
### Requisitos Previos

* Node.js: Asegúrate de que Node.js esté instalado en tu máquina. Puedes descargarlo desde [nodejs.org](nodejs.org).
* Base de Datos: Configura una base de datos local (por ejemplo, MySQL, MariaDB).

### Pasos
1. Clona el Repositorio:

```
git clone https://github.com/papiricoh/futPlannerAPI.git
cd futplanner
```

2. Carga el SQL en Tu Base de Datos:

* Importa el [archivo SQL proporcionado](database.sql) en tu base de datos para configurar las tablas requeridas y los datos iniciales.

3. Renombra el Archivo de Configuración:

* Navega al directorio futPlannerAPI/api/config/.
* Renombra config-template.js a config.js y actualízalo con tus credenciales de acceso a la base de datos local.

4. Instala las Dependencias:

```
npm install
```

5. Inicia la API:

```
node api.js
```

6. Crea un Usuario Inicial:

* Dado que la base de datos viene con datos de depuración pero no con datos de prueba manual, [crea un usuario utilizando una llamada a la API](README.MD/#users). Puedes usar Postman u otra herramienta similar para enviar una solicitud POST a la API.





