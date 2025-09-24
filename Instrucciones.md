## Descripción

El proyecto en kubernetes está organizado de la siguiente manera:

`namespace.yaml`: Define un namespace "super-contador" para tener todas las cosas organizadas en un lugar

`redis-persistencia.yaml`: Define la persistencia de datos para redis

`redis-deployment.yaml`: Define el deployment para redis utilizando el volumen definido en `redis-persistencia.yaml`

`redis-service.yaml`: Define el service para redis

`backend-deployment.yaml`: Define el deployment de la imagen del backend

`backend-service.yaml`: Define el serivicio para acceder al backend utilizando nodeport (Kubernetes de docker desktop/minikube)

`frontend-configmap.yaml`: Define la configuración para el frontend donde se especifica la url donde está corriedo el backend.
Esta yaml define un "string" que será leído como configuración en runtime por el frontend para conectarse al backend. En el yaml `frontend-deployment.yaml`
se monta la configuración como un volumen, escribiendose en un archivo config.js dentro de las carpetas que usa nginx
`frontend-deployment.yaml`: Define el deployment para la imagen del frontend

`frontend-service.yaml`: Define el servicio para acceder al frontend utilizando nodeport (Kubernetes de docker desktop/minikube)


## Implementación

En el frontend se tuvo que cambiar la forma de configurar la conexión con el backend, ya que la url puede cambiar dependiendo de donde
se despliegue (google cloud, minikube, etc).
Anteriormente la dirección se definía en tiempo de compilación, lo que provocaba que se tuviera que hacer una nueva imagen cada vez que se
quisiera cambiar la url. Ahora se utiliza un configmap de kubernetes para escribir un archivo config.js en la carpeta que utiliza nginx, y se
carga en tiempo de ejecución en el frontend, permitiendo cambiar la url de forma dinámica cambiando el valor desde kubectl y reiniciando el deployment

Esta entrega está hecha para correr en el kubernetes de Docker Desktop de forma local.
Las imágenes de frontend y backend están publicadas en mi repositorio de GitHub para poder descargarlas directamente y no tener que hacer los builds

El proyecto está subido en GitHub:
[https://github.com/LagFlow/trabajo--docker-compose.git]


## Archivos

A continuación se incluyen los contenidos de los archivos yaml mencionados anteriormente:

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: super-contador
```

```yaml
# redis-persistencia.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-data
  namespace: super-contador
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 1Gi            # adjust to your needs
```

```yaml
# redis-deployment.yaml 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: super-contador
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:8.2-alpine
          ports:
            - containerPort: 6379
          volumeMounts:
            - name: redis-storage
              mountPath: /data
      volumes:
        - name: redis-storage
          persistentVolumeClaim:
            claimName: redis-data
```

```yaml
# redis-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: super-contador
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
```

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: super-contador
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/lagflow/trabajo--docker-compose:backend
          ports:
            - containerPort: 3000
          env:
            - name: REDIS_HOST
              value: redis           # matches the Service name
            - name: REDIS_PORT
              value: "6379"
```

```yaml
# backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: super-contador
spec:
  type: NodePort
  selector:
    app: backend
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30081    # optional: specify the external port (30000-32767 range)
```

```yaml
# frontend-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: super-contador
data:
  config.js: |
    window._env_ = {
      VITE_BACKEND: "http://localhost:30081"
    };
```

```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: super-contador
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: ghcr.io/lagflow/trabajo--docker-compose:frontend
          ports:
            - containerPort: 80
          volumeMounts:
            - name: config-volume
              mountPath: /usr/share/nginx/html/config.js
              subPath: config.js
      volumes:
        - name: config-volume
          configMap:
            name: frontend-config
```

```yaml
# frontend-service.yaml 
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: super-contador
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080    # optional: specify the external port (30000-32767 range)
```

