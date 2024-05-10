const ENV = {
    PRODUCTION: {
        API_BASE_URL: 'http://192.168.29.130:7000/api/',
    },
    DEVELOPMENT: {
        API_BASE_URL:
            'https://ga5rpjecp76dvmpztnkpgexvoa0tbcnt.lambda-url.us-east-1.on.aws/api',
    },
    LOCAL: {
        API_BASE_URL: 'http://192.168.29.130:7000/api/',
    },
}

export default ENV
