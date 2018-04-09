import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ResourceServer from './game/ResourceServer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('has correct error on missing resource', async () => {
  const filenames = [];

  const errorName = 'hejsan';
  const errorFilepath = 'NO_EXIST.txt';

  filenames.push({
    name: errorName,
    path: errorFilepath,
  });

  expect.assertions(1);
  const rs = new ResourceServer();
  /* eslint-disable function-paren-newline */
  await expect(rs.requestResources(filenames)).rejects.toEqual(
    new Error(`Failed to load resource ${errorName} from path resources/${errorFilepath}`),
  );
  /* eslint-enable function-paren-newline */
});
