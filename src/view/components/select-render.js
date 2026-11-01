export const selectRender = (parent, data) => {
  data.map((item) => {
    parent.innerHTML += `
         <option value="${Object.keys(item)}">${Object.values(item)}</option>
        `;
  });
};
