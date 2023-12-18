FROM postgres:latest
ENV POSTGRES_DB=bd_gas_nar
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=1234
COPY ./bd_gas_nar_postgresql.sql /docker-entrypoint-initdb.d/

