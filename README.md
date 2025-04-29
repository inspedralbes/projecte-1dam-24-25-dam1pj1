# 🏍️ Aplicació de Gestió de Motocicletes

## 📝 Descripció
Aquest projecte és una aplicació web completa per a la gestió de motocicletes i les seves categories. Desenvolupada com a part del curs 1DAM (primer any de Desenvolupament d'Aplicacions Multiplataforma), aquesta aplicació demostra la implementació d'una arquitectura full-stack moderna.

## 🏗️ Arquitectura
L'aplicació segueix el patró Model-Vista-Controlador (MVC):

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Rutes     │────▶│Controladors │────▶│   Models    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │                                       │
       │                                       ▼
       │                               ┌─────────────┐
       │                               │  Base Dades │
       ▼                               └─────────────┘
┌─────────────┐
│   Vistes    │
└─────────────┘
```

## 🛠️ Stack Tecnològic
- **🚀 Backend**: Node.js amb Express
- **💾 Base de Dades**: MySQL
- **🔄 ORM**: Sequelize
- **🎨 Frontend**: EJS (Embedded JavaScript Templates)
- **🐳 Containerització**: Docker i Docker Compose

## 🐳 Infraestructura Docker
L'aplicació està containeritzada utilitzant tres contenidors Docker diferents:

### 1. 🖥️ Contenidor de l'Aplicació
- **Imatge**: Node.js
- **Funció**: Executa l'aplicació Express
- **Port**: 3000
- **Volums**: Munta el codi font per a desenvolupament en calent

### 2. 📊 Contenidor de la Base de Dades
- **Imatge**: MySQL
- **Funció**: Gestiona la persistència de dades
- **Port**: 3306
- **Volums**: Persistència de dades MySQL

### 3. 🔄 Contenidor d'Adminer
- **Imatge**: Adminer
- **Funció**: Interfície web lleugera per a gestionar la base de dades
- **Port**: 8080
- **Depèn de**: Contenidor MySQL

### 📝 Configuració Docker
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/usr/src/app
    depends_on:
      - db

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db
```

## 📂 Estructura del Projecte
```
src/
├── app.js            # Punt d'entrada de l'aplicació
├── db.js             # Connexió a la base de dades
├── models/           # Models de dades
│   ├── Category.js   # Model de categories
│   └── Motorcycle.js # Model de motocicletes
├── routes/           # Rutes de l'API
├── views/            # Plantilles EJS
└── public/           # Arxius estàtics
    └── images/       # Imatges
```

## 🚀 Com Començar

### 🔧 Prerequisits
- Node.js
- Docker i Docker Compose
- MySQL

### 🛠️ Instal·lació

1. Clona el repositori:
```bash
git clone [url-del-repositori]
```

2. Instal·la les dependències:
```bash
npm install
```

3. Configura les variables d'entorn:
Crea dos arxius de configuració:

**.env per a desenvolupament local:**
```env
MYSQL_HOST=localhost
MYSQL_USER=usuari
MYSQL_PASSWORD=contrasenya
MYSQL_DATABASE=nom_base_dades
PORT=3000
```

**.env.docker per a l'entorn Docker:**
```env
MYSQL_HOST=db
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=motorcycles_db
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password
PORT=3000
```

> 📝 **Nota**: L'arxiu `.env.docker` utilitza `db` com a host, que és el nom del servei MySQL al docker-compose.

4. Inicia l'aplicació:

**Mode Desenvolupament:**
```bash
npm run dev
```

**Mode Docker:**
```bash
docker-compose up
```

## 💡 Funcionalitats Principals

### 🏍️ Gestió de Motocicletes
- Crear, llegir, actualitzar i eliminar motocicletes
- Assignar categories
- Pujar imatges de motocicletes
- Gestionar detalls tècnics

### 📑 Gestió de Categories
- Crear i gestionar categories
- Associar motocicletes a categories
- Visualitzar motocicletes per categoria

## 🌐 Endpoints i Rutes

### 🔄 API REST Endpoints

#### Categories
- `GET /api/categories`: Llista totes les categories
- `POST /api/categories`: Crea una nova categoria
- `PUT /api/categories/:id`: Actualitza una categoria
- `DELETE /api/categories/:id`: Elimina una categoria

#### Motocicletes
- `GET /api/motorcycles`: Llista totes les motocicletes
- `POST /api/motorcycles`: Crea una nova motocicleta
- `PUT /api/motorcycles/:id`: Actualitza una motocicleta
- `DELETE /api/motorcycles/:id`: Elimina una motocicleta

### 🎨 Rutes de Renderització (EJS)

#### Categories
- `GET /categories`: Mostra la llista de categories
- `GET /categories/new`: Formulari per crear una nova categoria
- `GET /categories/edit/:id`: Formulari per editar una categoria
- `POST /categories`: Processa la creació d'una categoria
- `POST /categories/:id`: Processa l'actualització d'una categoria
- `POST /categories/delete/:id`: Elimina una categoria

#### Motocicletes
- `GET /motorcycles`: Mostra la llista de motocicletes
- `GET /motorcycles/new`: Formulari per crear una nova motocicleta
- `GET /motorcycles/edit/:id`: Formulari per editar una motocicleta
- `POST /motorcycles`: Processa la creació d'una motocicleta
- `POST /motorcycles/:id`: Processa l'actualització d'una motocicleta
- `POST /motorcycles/delete/:id`: Elimina una motocicleta

## 🧪 Models de Dades

### 📋 Category
```javascript
{
  name: String (obligatori)
}
```

### 🏍️ Motorcycle
```javascript
{
  name: String (obligatori),
  country: String,
  brand: String (obligatori),
  description: Text,
  img: String,
  cc: Integer (obligatori)
}
```

## 🔧 Desenvolupament
- Utilitza `nodemon` per al desenvolupament amb recàrrega automàtica
- Docker per a la containerització
- Sequelize per a la gestió de la base de dades

## 📝 Llicència
Aquest projecte està sota la llicència MIT.
