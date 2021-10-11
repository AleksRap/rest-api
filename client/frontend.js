const upperFirstSymbol = (word) => word[0].toUpperCase() + word.slice(1);

class Fetch {
  /** Requests */
  static async get(url) {
    return await this._request(url, 'GET');
  }
  static async post(url, data) {
    return await this._request(url, 'POST', data);
  }
  static async put(url, data) {
    return await this._request(url, 'PUT', data);
  }
  static async delete(url) {
    return await this._request(url, 'DELETE');
  }

  /** Other */
  static async _request(url, method = 'GET', data = null) {
    try {
      const headers = {};
      let body;

      if (data) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }

      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      return await response.json();
    } catch (e) {
      console.error('Error: ', e.message);
    }
  }
}

class Spinner {
  /** Templates */
  static getTemplate() {
    return `
      <div class="d-flex align-item-center justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    `;
  }
}

class Contacts {
  api = '/api/contacts';

  _contacts = [];
  set contacts(value) {
    this._contacts = value;
    this._renderContacts();
  }

  _isLoading = false;
  set isLoading(value) {
    this._isLoading = value;
    this._renderContacts();
  }

  constructor(selector) {
    this.contactsEl = document.querySelector(selector);
    this._startRender();
  }

  /** Actions */
  async addContact(contact) {
    if (contact.name && contact.value) {
      const newContact = await Fetch.post(this.api, contact)
      this.contacts = [...this._contacts, newContact];
    }
  }
  async removeContact(id) {
    const isDeleted = await Fetch.delete(`${this.api}/${id}`);
    if (isDeleted) this.contacts = this._contacts.filter(({ id: idContact }) => id !== idContact);
  }
  markContact(id) {
    this.contacts = this._contacts.map((contact) => {
      if (id === contact.id) contact.isMark = !contact.isMark;
      return contact;
    });
  }

  /** Requests */
  async getContacts() {
    this.isLoading = true;
    this.contacts = await Fetch.get(this.api);
    this.isLoading = false;
  }

  /** Templates */
  _getContactTemplate(id, name, value, isMark) {
    return `
      <div class="card mb-3" id="${id}" data-name="card" style="background-color: ${isMark ? 'lightgray' : 'white'}">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">${value}</p>
          <button class="btn btn-primary" data-action="mark">Отметить</button>
          <button class="btn btn-danger" data-action="remove">Удалить</button>
        </div>
      </div>
    `;
  }
  _getEmptyContactsTemplate() {
    return `
      <p>Контактов нет</p>
    `;
  }

  /** Other */
  async _startRender() {
    this._bind();
    await this.getContacts();
  }
  _bind() {
    this.contactsEl.addEventListener('click', (e) => {
      const { target } = e;

      switch (target.dataset.action) {
        case 'mark': {
          const id = target.closest('[id]').id;
          this.markContact(id);
          return;
        }

        case 'remove': {
          const id = target.closest('[id]').id;
          this.removeContact(id);
          return;
        }

        default: {
          return;
        }
      }
    });
  }
  _renderContacts() {
    if (this._isLoading) {
      this.contactsEl.innerHTML = Spinner.getTemplate();
      return;
    }

    if (this._contacts.length) {
      this.contactsEl.innerHTML = this._contacts
        .map(({ id, name, value, isMark }) => this._getContactTemplate(id, name, value, isMark)).join('');
    } else {
      this.contactsEl.innerHTML = this._getEmptyContactsTemplate();
    }
  }
}

const contacts = new Contacts('#contacts');

class Form {
  _name = '';
  set name(value) {
    this._name = value;
    this._checkBtnCreate();
  }

  _value = '';
  set value(value) {
    this._value = value;
    this._checkBtnCreate();
  }

  constructor(selector) {
    this.formEl = document.querySelector(selector);
    this.inputNameEl = this.formEl.querySelector('#name');
    this.inputValueEl = this.formEl.querySelector('#value');
    this.btnCreate = this.formEl.querySelector('#btn-create');

    this._bind();
    this._checkBtnCreate();
  }

  /** Actions */
  _onChangeInput(name) {
    this[`input${upperFirstSymbol(name)}El`].addEventListener('input', (e) => {
      const { value: valueInput } = e.currentTarget;
      this[name] = valueInput;
    });
  }
  _onSubmitForm() {
    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();

      contacts.addContact({
        name: this._name,
        value: this._value,
      });

      this._clearInputs('name');
      this._clearInputs('value');
    });
  }
  _clearInputs(name) {
    this[name] = '';
    this[`input${upperFirstSymbol(name)}El`].value = '';
  }
  _checkBtnCreate() {
    if (this._name && this._value) {
      this.btnCreate.removeAttribute('disabled');
      this.btnCreate.style.pointerEvents = 'initial';
    } else {
      this.btnCreate.setAttribute('disabled', true);
      this.btnCreate.style.pointerEvents = 'none';
    }
  }

  /** Other */
  _bind() {
    this._onChangeInput('name');
    this._onChangeInput('value');
    this._onSubmitForm();
  };
}

new Form('#form');
