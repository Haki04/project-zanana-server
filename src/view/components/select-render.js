export const selectRender = (parent, data) => {
  if (!parent) return;
  data.map((item) => {
    parent.innerHTML += `
         <option value="${item}" on>${item}</option>
        `;
  });
};
