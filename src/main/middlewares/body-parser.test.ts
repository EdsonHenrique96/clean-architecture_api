import request from 'supertest';
import app from '../config/app';

describe('Middleware: BodyParser', () => {
  it('Should parser request body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });

    const requestBody = {
      name: 'Edson',
      age: 24,
    };

    await request(app)
      .post('/test_body_parser')
      .send(requestBody)
      .expect(requestBody);
  });
});
