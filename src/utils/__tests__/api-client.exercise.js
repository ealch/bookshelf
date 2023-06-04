// 🐨 you'll need the test server
// 💰 the way that our tests are set up, you'll find this in `src/test/server/test-server.js`
// import {server, rest} from 'test/server'
import { server, rest } from 'test/server'
// 🐨 grab the client
// import {client} from '../api-client'
import { client } from '../api-client'


import { queryCache } from 'react-query'
import * as auth from 'auth-provider'

jest.mock("react-query");
jest.mock("auth-provider")


const apiURL = process.env.REACT_APP_API_URL



// 🐨 flesh these out:

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  // 🐨 add a server handler to handle a test request you'll be making
  // 💰 because this is the first one, I'll give you the code for how to do that.
  const endpoint = 'test-endpoint'
  const mockResult = { mockValue: 'VALUE' }

  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  // 🐨 call the client (don't forget that it's asynchronous)
  // 🐨 assert that the resolved value from the client call is correct
  const result = await client(endpoint);
  expect(result).toStrictEqual(mockResult)
})


test('adds auth token when a token is provided', async () => {
  // 🐨 create a fake token (it can be set to any string you want)
  const FAKE_TOKEN = "ASD123";

  const endpoint = 'test-endpoint'
  const mockResult = { mockValue: 'VALUE' }

  // 🐨 create a "request" variable with let
  let request;
  // 🐨 create a server handler to handle a test request you'll be making
  // 🐨 inside the server handler, assign "request" to "req" so we can use that
  // to assert things later.
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult))
    }),
  )
  // 🐨 call the client with the token (note that it's async)
  const result = await client(endpoint, { token: FAKE_TOKEN });
  // 🐨 verify that `request.headers.get('Authorization')` is correct (it should include the token)
  expect(result).toStrictEqual(mockResult)
  expect(request.headers.get("Authorization")).toContain(FAKE_TOKEN)
})



test('allows for config overrides', async () => {
  // 🐨 do a very similar setup to the previous test

  const endpoint = 'test-endpoint'
  const mockResult = { mockValue: 'VALUE' }
  let request;
  server.use(
    rest.put(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult))
    }),
  )
  // 🐨 create a custom config that specifies properties like "mode" of "cors" and a custom header
  // 🐨 call the client with the endpoint and the custom config
  await client(endpoint, {
    headers: {
      MY_CUSTOM_HEADER: "THIS_IS_MY_CUSTOM_HEADER"
    },
    method: 'PUT'
  });

  // 🐨 verify the request had the correct properties
  expect(request.headers.get("MY_CUSTOM_HEADER")).toBe("THIS_IS_MY_CUSTOM_HEADER")
})


test('when data is provided, it is stringified and the method defaults to POST', async () => {
  // 🐨 create a mock data object
  const data = {
    user: "ealch",
    password: "1992"
  };
  const endpoint = 'test-endpoint'
  const mockResult = { mockValue: 'VALUE' }

  let request;

  // 🐨 create a server handler very similar to the previous ones to handle the post request
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult))
    }),
  )

  // 🐨 call client with an endpoint and an object with the data
  await client(endpoint, { data })
  // 🐨 verify the request.body is equal to the mock data object you passed
  expect(request.body).toStrictEqual(data)
})


// extra credit (I)
test("when response.ok is false, the promise is rejected with the data returned from the server", async () => {
  const ERROR_MSG = { message: 'this is the response!' }

  const endpoint = 'test-endpoint'
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(ERROR_MSG))
    }),
  )

  const response = client(endpoint);

  await expect(response).rejects.toEqual(ERROR_MSG)
})

test("when response.status is 401 (Unauthorized), we log the user out and clear the query cache", async () => {
  const ERROR_MSG = { message: "Please re-authenticate." }

  const endpoint = 'test-endpoint'
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(ERROR_MSG))
    }),
  )

  expect(queryCache.clear).toBeCalledTimes(0);
  expect(auth.logout).toBeCalledTimes(0);

  const response = client(endpoint);
  await expect(response).rejects.toEqual(ERROR_MSG)

  expect(queryCache.clear).toBeCalledTimes(1);
  expect(auth.logout).toBeCalledTimes(1);
})





