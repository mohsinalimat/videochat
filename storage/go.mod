module nkonev.name/storage

require (
	contrib.go.opencensus.io/exporter/jaeger v0.2.0
	github.com/GeertJohan/go.rice v1.0.0
	github.com/go-ozzo/ozzo-validation/v4 v4.2.1
	github.com/golang-migrate/migrate/v4 v4.11.0
	github.com/guregu/null v4.0.0+incompatible
	github.com/jackc/pgx/v4 v4.8.1
	github.com/labstack/echo/v4 v4.1.16
	github.com/microcosm-cc/bluemonday v1.0.3
	github.com/nkonev/jaeger-uber-propagation-compat v0.0.0-20200708125206-e763f0a72519
	github.com/sirupsen/logrus v1.6.0
	github.com/spf13/viper v1.7.0
	github.com/stretchr/testify v1.5.1
	go.opencensus.io v0.22.4
	go.uber.org/fx v1.12.0
	golang.org/x/net v0.0.0-20200602114024-627f9648deb9 // indirect
	golang.org/x/sys v0.0.0-20200622214017-ed371f2e16b4 // indirect
)

go 1.13