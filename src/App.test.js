import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'file-system';
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
  await expect(rs.requestResources(filenames)).rejects.toEqual(
    new Error(`Failed to load resource ${errorName} from path resources/${errorFilepath}`),
  );
});

// it(
//   'loads correct resources',
//   () => {
//     const filenames = [];
//     const outputObject = {};
//     fs.recurseSync('./public/resources', (filepath, relative, filename) => {
//       filenames.push({
//         name: 'hello',
//         path: filename,
//       });

//       outputObject[filename] = 'DOESNT_MATTER';
//     });

//     // expect.assertions(1);
//     const rs = new ResourceServer();
//     // rs.requestResources(filenames).then(msg => console.log(msg));
//     return expect(rs.requestResources(filenames)).resolves.toMatch(outputObject);
//   },
//   15000,
// );
