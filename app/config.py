postgresql = {
    'host': 'postgres',
    'user': 'debug',
    'passwd': 'debug',
    'db': 'shop_backend'
}
postgresqlConfig = f"postgresql://{postgresql['user']}:{postgresql['passwd']}@{postgresql['host']}/{postgresql['db']}"
