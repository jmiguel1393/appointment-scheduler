# 🏥 Sistema de Agendamiento de Citas Médicas - Reto Técnico

Este proyecto implementa una arquitectura basada en servicios utilizando **AWS Serverless** para gestionar citas médicas de asegurados en **Perú** y **Chile**, integrando SNS, SQS, EventBridge, DynamoDB y RDS.

## 📁 Estructura del Monorepo

```
/appointment-api         → API REST para agendar y consultar citas
/appointment-handler     → Lambda que escucha SQS (PE, CL) y guarda en RDS
/appointment-updater     → Lambda que escucha confirmaciones y actualiza DynamoDB
/shared                  → Código común (utilidades, configuración, validaciones)
```

## 🚀 Flujo del Sistema

1. Un cliente realiza una solicitud `POST /appointments` a `appointment-api`.
2. Se almacena la cita provisionalmente en **DynamoDB** y se publica un mensaje en **SNS**.
3. **SNS** enruta el mensaje a **SQS-PE** o **SQS-CL** según el país.
4. Lambda `appointment-handler` consume el mensaje de su respectivo SQS y almacena la cita en una base de datos **RDS MySQL**.
5. Luego, se publica una **confirmación de agendamiento** en **EventBridge**.
6. Lambda `appointment-updater` escucha un SQS conectado a EventBridge y actualiza el estado de la cita en **DynamoDB** a `completed`.

## ✅ Funcionalidades

- ✅ Registro de cita médica (`POST /appointments`)
- ✅ Consulta de citas por asegurado (`GET /appointments/:insuredId`)
- ✅ Procesamiento por país con Lambdas dedicadas
- ✅ Confirmación y actualización del estado vía EventBridge

## ⚙️ Requisitos

- Node.js 18+
- Serverless Framework (`npm install -g serverless`)
- AWS CLI configurado
- Cuenta de AWS con los siguientes servicios habilitados:
  - SNS
  - SQS
  - EventBridge
  - Lambda
  - DynamoDB
  - RDS (MySQL)

## 🔧 Configuración

1. Crear un archivo `.env` en cada carpeta con las siguientes variables:

```env
AWS_REGION=us-east-2
DYNAMODB_TABLE=appointments
SNS_TOPIC_PE=arn:aws:sns:us-east-2:<your_account_id>:appointments-pe
SNS_TOPIC_CL=arn:aws:sns:us-east-2:<your_account_id>:appointments-cl
MYSQL_HOST=<your-mysql-host>
MYSQL_USER=<your-mysql-user>
MYSQL_PASSWORD=<your-mysql-password>
MYSQL_DB=appointments
EVENT_BUS_NAME=appointment-events
SQS_QUEUE_ARN_PE=arn:aws:sqs:us-east-2:<your_account_id>:appointments-queue-pe
SQS_QUEUE_ARN_CL=arn:aws:sqs:us-east-2:<your_account_id>:appointments-queue-cl
IS_OFFLINE=true
```

2. Instalar dependencias en cada carpeta:

```bash
cd appointment-api && npm install
cd ../appointment-handler && npm install
cd ../appointment-updater && npm install
```

3. Desplegar los servicios con Serverless:

```bash
sls deploy
```

## 🧪 Ejecutar cada servicio localmente

Cada componente se puede ejecutar localmente con Serverless Offline.

✅ Pasos para correr un componente:

1. Navegar a la carpeta del componente:

```bash
cd appointment-handler
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en modo local:

```bash
npx serverless offline
```

## 📮 Pruebas de API

### POST /appointments

```bash
curl -X POST https://<api-url>/appointments   -H "Content-Type: application/json"   -d '{
    "insuredId": "123456",
    "scheduleId": "abc123",
    "countryISO": "PE"
  }'
```

### GET /appointments/:insuredId

```bash
curl https://<api-url>/appointments/123456
```

## 🧪 Pruebas Unitarias

Cada servicio incluye pruebas básicas con Jest:

```bash
npm run test
```

## 📚 Notas Técnicas

- Arquitectura basada en eventos, desacoplada y escalable.
- Uso de Lambdas específicas por país.
- Serverless Framework para despliegue e infraestructura como código.
- Código desacoplado y reusable mediante la carpeta `/shared`.

## 📦 Componentes

- `appointment-api`: Expone endpoints para registrar y consultar citas.
- `appointment-handler-pe/cl`: Procesan mensajes desde SQS y guardan en RDS.
- `appointment-updater`: Actualiza estado de la cita a `completed` en DynamoDB.
- `shared`: Contiene lógica común como conexión a MySQL, utilidades y validadores.

## 🧩 Consideraciones

- Es recomendable crear los tópicos SNS y colas SQS manualmente o incluirlos en los `serverless.yml`.
- El entorno puede adaptarse a LocalStack si se desea probar localmente.
- Se siguieron principios de separación de responsabilidades y buenas prácticas con TypeScript.
