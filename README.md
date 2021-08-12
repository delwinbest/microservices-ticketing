# Ticketing Microservices Example

This repo contains a collection of microservice code each hosted in their own dockerised containers. The entire collection is to be run on a Kubernetes cluster, using GitHub workflows for Prod and Skaffold for continuous deployment into local Docker and Kubernetes instances. Folder Structure:

- [.github] Github workflow scripts
- [infra] Kubernetes Service Container Build and Deploy Configuration
- [common] Common NPM module which contains Event, Publisher and Listener base components
- [client] NextJS User Interface
- [auth] User Authetication Microservice
- [expiration] Order Expiration service expires Orders if not payed on time
- [orders] Orders Service
- [payments] Payment Processing Service
- [tickets] Ticket Processing Service

## Getting Started

TODO

### Prerequisities

In order to run this container you'll need the following installed:

- **Docker:** [Windows](https://docs.docker.com/windows/started), [OS X](https://docs.docker.com/mac/started/), [Linux](https://docs.docker.com/linux/started/)
- **Kubernetes:** Accessible via 'kubectl'. This can either be enabled in Docker Desktop / Settings, or access configured to a AWS EKS or Google Kubenetes Cluster. See [Getting Started](https://kubernetes.io/docs/setup/).
- **Ingress NGINX:** Provides access to docker containers running inside a clusters. Steps to enable for each platform can be found on the Kubernetes [NGINX Installation Guide](https://kubernetes.github.io/ingress-nginx/deploy/)

For Continuous Test / Development:

- Skaffold: Skaffold handles the workflow for building, pushing and deploying your application. [Install Guide](https://skaffold.dev/docs/install/). If using Mac OSX, I strgonly suggest using [Homebrew](https://brew.sh/) package management to install Skaffold.

### Usage

1. **Create a [Stripe.com](https://dashboard.stripe.com/register) Dev Account.** Once logged in, head over for the 'Developers / API keys' screen and copy your 'Secret key' and 'Publishable key'. This is needed to simulate credit card payments.
2. **Add Secrets to Kubernets Cluster** by running (insert the key/text win the '$' placeholders) from a local terminal:

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=$RANDOM_TEST
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=$STRIPE_KEY
kubectl create secret generic stripe-pub-key --from-literal=STRIPE_PUB_KEY=$STRIPE_PUBLISHABLE_KEY
```

3. Download this repo's source code and start a terminal from with the directory.
4. Build and Deploy the your Dev environment by running:

```shell
skaffold dev
```

#### Container Parameters

List the different parameters available to your container

```shell
docker run give.example.org/of/your/container:v0.2.1 parameters
```

One example per permutation

```shell
docker run give.example.org/of/your/container:v0.2.1
```

Show how to get a shell started in your container too

```shell
docker run give.example.org/of/your/container:v0.2.1 bash
```

#### Environment Variables

- `VARIABLE_ONE` - A Description
- `ANOTHER_VAR` - More Description
- `YOU_GET_THE_IDEA` - And another

#### Volumes

- `/your/file/location` - File location

#### Useful File Locations

- `/some/special/script.sh` - List special scripts
- `/magic/dir` - And also directories

## Built With

- List the software v0.1.3
- And the version numbers v2.0.0
- That are in this container v0.3.2

## Find Us

- [GitHub](https://github.com/your/repository)
- [Quay.io](https://quay.io/repository/your/docker-repository)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/your/repository/tags).

## Authors

- **Billie Thompson** - _Initial work_ - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/repository/contributors) who
participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- People you want to thank
- If you took a bunch of code from somewhere list it here
