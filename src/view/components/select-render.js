export const selectRender = (parent, data) => {
  if (!parent) return;
  data.map((item) => {
    parent.innerHTML += `
         <option value="${Object.keys(item)}">${Object.values(item)}</option>
        `;
  });
};
