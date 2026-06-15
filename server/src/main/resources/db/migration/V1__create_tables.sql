CREATE TABLE monitored_apis (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    check_interval INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE api_checks (
    id BIGSERIAL PRIMARY KEY,
    status_code INTEGER,
    response_time BIGINT,
    status VARCHAR(50),
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    api_id BIGINT REFERENCES monitored_apis(id) ON DELETE CASCADE
);
