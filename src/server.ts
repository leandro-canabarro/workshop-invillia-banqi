import { createServer, Model } from 'miragejs';

export function makeServer() {
  createServer({
    models: {
      order: Model,
    },

    seeds(server) {
      server.create('order', { id: 1, name: 'Pedido 1', status: 'Pendente' });
      server.create('order', { id: 2, name: 'Pedido 2', status: 'Concluído' });
    },

    routes() {
      this.namespace = 'api';

      this.get('/orders', (schema) => {
        return schema.orders.all();
      });

      this.post('/orders', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.orders.create(attrs);
      });

      this.put('/orders/:id', (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody);
        let id = request.params.id;
        let order = schema.orders.find(id);
        return order.update(newAttrs);
      });

      this.delete('/orders/:id', (schema, request) => {
        let id = request.params.id;
        return schema.orders.find(id).destroy();
      });
    },
  });
}
