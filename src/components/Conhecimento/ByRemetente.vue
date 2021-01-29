<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <h5>{{ h5Titulo }}</h5>
        <br />
        <div class="p-grid p-fluid">
          <div class="p-col-12 p-md-4">
            <div class="p-inputgroup">
              <Button
                icon="pi pi-check"
                class="p-button-success"
                label="Encontrar"
                v-on:click="callFindByRemetenteMethod"
                v-if="isBtnShow"
              />
              <InputMask
                v-model="cnpj"
                mask="999.999.999/9999-9"
                :unmask="true"
                placeholder="CNPJ"
              />
              <Button
                icon="pi pi-times"
                class="p-button-danger"
                v-on:click="cleanCnpjVariable"
              />

              <Toast />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-col-12">
      <div class="card">
        <h4 v-if="isRenderSpinnerPesquisa">{{ msgH4Pesquisa }}</h4>

        <ProgressSpinner v-if="isRenderSpinnerPesquisa" />

        <DataTable
          :value="conhecimentos"
          rowGroupMode="rowspan"
          groupRowsBy="emitente.cnpj"
          sortMode="single"
          sortField="emitente.cnpj"
          :sortOrder="1"
          v-if="isRenderDatatable"
          :lazy="true"
          :paginator="true"
          :rows="10"
          :totalRecords="totalRecords"
          :loading="loading"
          @page="onPage($event)"
          @sort="onSort($event)"
        >
          <Column header="#" headerStyle="width:3em" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.index }}
            </template>
          </Column>
          <Column field="emitente.cnpj" header="Emitente" :sortable="true">
            <template #body="slotProps">
              <span class="image-text">{{ slotProps.data.emitente.nome }}</span>
            </template>
          </Column>
          <Column field="numero" header="Núm/Serie" :sortable="true">
            <template #body="slotProps">
              <span class="image-text"
                >{{ slotProps.data.numero }} / {{ slotProps.data.serie }}</span
              >
            </template>
          </Column>

          <Column field="emissao" header="Emissão" :sortable="true"></Column>
          <Column filed="total" header="Total" :sortable="true">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.total) }}
            </template>
          </Column>
          <Column :exportable="false">
            <template #body="slotProps">
              <Button
                icon="pi pi-search"
                class="p-button-rounded p-button-success p-mr-2"
                @click="viewCurrentObject(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <Dialog
      v-model:visible="isViewObjectDialogVisible"
      header="Detalhes do Conhecimento"
      :modal="true"
      class="p-fluid"
      :style="{ width: '70vw' }"
      :maximizable="true"
    >
      <TabView class="tabview-custom">
        <TabPanel>
          <template #header>
            <i class="pi pi-info-circle"></i>
            <span>CT-e</span>
          </template>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="numero">Número</label>
              <InputText
                id="numero"
                v-model.trim="currentConhecimento.numero"
                :readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Serie</label>
              <InputText
                id="serie"
                v-model.trim="currentConhecimento.serie"
                :readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="emissao">Emissão</label>
              <InputText
                id="emissao"
                v-model.trim="currentConhecimento.emissao"
                :readonly="true"
              />
            </div>
          </div>

          <h5>Valores</h5>

          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="numeor">Valor Total Serviço</label>

              <InputNumber
                v-model="currentConhecimento.total"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Valor ICMS</label>
              <InputNumber
                v-model="currentConhecimento.imposto.baseCalculo"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
              />
            </div>
            <div class="p-field p-col">
              <label for="emissao">Base Cálculo ICMS</label>
              <InputNumber
                v-model="currentConhecimento.imposto.valorIcms"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
              />
            </div>
          </div>
          <h5>Emitente</h5>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">CNPJ</label>

              <InputMask
                id="cnpj"
                v-model.trim="currentConhecimento.emitente.cnpj"
                mask="999.999.999/9999-9"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Nome</label>
              <Textarea
                v-model="currentConhecimento.emitente.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
          </div>

          <h5>Remetente</h5>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">CNPJ</label>

              <InputMask
                id="cnpj"
                v-model.trim="currentConhecimento.remetente.cnpj"
                mask="999.999.999/9999-9"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Nome</label>
              <Textarea
                v-model="currentConhecimento.remetente.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
          </div>

          <h5>Destinatario</h5>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">CNPJ</label>

              <InputMask
                id="cnpj"
                v-model.trim="currentConhecimento.destinatario.cnpj"
                mask="999.999.999/9999-9"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Nome</label>
              <Textarea
                v-model="currentConhecimento.destinatario.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
          </div>

          <h5>Fluxo</h5>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">De</label>

              <Textarea
                v-model="currentConhecimento.origem.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Para</label>
              <Textarea
                v-model="currentConhecimento.destino.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <template #header>
            <span>Emitente</span>
            <i class="pi pi-id-card"></i>
          </template>

          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">CNPJ</label>

              <InputMask
                id="cnpj"
                v-model.trim="currentConhecimento.emitente.cnpj"
                mask="999.999.999/9999-9"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Nome</label>
              <Textarea
                v-model="currentConhecimento.emitente.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
          </div>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">Endereço</label>

              <Textarea
                id="cnpj"
                v-model.trim="currentConhecimento.emitente.endereco.logradouro"
                rows="3"
                cols="30"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="cep">CEP</label>
              <InputMask
                id="cep"
                v-model.trim="currentConhecimento.emitente.endereco.cep"
                mask="99999-999"
                :unmask="true"
                readonly="true"
              />
            </div>
          </div>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">Município</label>

              <InputText
                id="cnpj"
                v-model.trim="currentConhecimento.emitente.endereco.cidade.nome"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="uf">UF</label>
              <InputText
                id="uf"
                v-model.trim="currentConhecimento.emitente.endereco.cidade.uf"
                :readonly="true"
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <template #header>
            <span>Remetente</span>
            <i class="pi pi-id-card"></i>
          </template>

          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">CNPJ</label>

              <InputMask
                id="cnpj"
                v-model.trim="currentConhecimento.remetente.cnpj"
                mask="999.999.999/9999-9"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Nome</label>
              <Textarea
                v-model="currentConhecimento.remetente.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
          </div>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">Endereço</label>

              <Textarea
                id="cnpj"
                v-model.trim="currentConhecimento.remetente.endereco.logradouro"
                rows="3"
                cols="30"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="cep">CEP</label>
              <InputMask
                id="cep"
                v-model.trim="currentConhecimento.remetente.endereco.cep"
                mask="99999-999"
                :unmask="true"
                readonly="true"
              />
            </div>
          </div>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">Município</label>

              <InputText
                id="cnpj"
                v-model.trim="
                  currentConhecimento.remetente.endereco.cidade.nome
                "
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="uf">UF</label>
              <InputText
                id="uf"
                v-model.trim="currentConhecimento.remetente.endereco.cidade.uf"
                :readonly="true"
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <template #header>
            <span>Destinatario</span>
            <i class="pi pi-id-card"></i>
          </template>

          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">CNPJ</label>

              <InputMask
                id="cnpj"
                v-model.trim="currentConhecimento.destinatario.cnpj"
                mask="999.999.999/9999-9"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="serie">Nome</label>
              <Textarea
                v-model="currentConhecimento.destinatario.nome"
                :autoResize="true"
                rows="1"
                cols="20"
                :readonly="true"
              />
            </div>
          </div>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">Endereço</label>

              <Textarea
                id="cnpj"
                v-model.trim="
                  currentConhecimento.destinatario.endereco.logradouro
                "
                rows="3"
                cols="30"
                :unmask="true"
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="cep">CEP</label>
              <InputMask
                id="cep"
                v-model.trim="currentConhecimento.destinatario.endereco.cep"
                mask="99999-999"
                :unmask="true"
                readonly="true"
              />
            </div>
          </div>
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="cnpj">Município</label>

              <InputText
                id="cnpj"
                v-model.trim="
                  currentConhecimento.destinatario.endereco.cidade.nome
                "
                readonly="true"
              />
            </div>
            <div class="p-field p-col">
              <label for="uf">UF</label>
              <InputText
                id="uf"
                v-model.trim="
                  currentConhecimento.destinatario.endereco.cidade.uf
                "
                :readonly="true"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveProduct"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import ConhecimentoService from "../../service/ConhecimentoService";
export default {
  data() {
    return {
      h5Titulo: "Encontrar por Remetente",
      cnpj: "",
      conhecimentos: null,
      isRenderDatatable: false,
      messages: [],
      isBtnShow: true,
      isRenderSpinnerPesquisa: false,
      msgH4Pesquisa: "",
      expandedRowGroups: null,
      isViewObjectDialogVisible: false,
      currentConhecimento: null,
      totalRecords: 0,
      loading: false,
      lazyParams: {
        page: 0,
        sortOrder: "desc",
        sortField: "emissao",
      },
    };
  },
  conhecimentoService: null,
  cnpjPesquisadoAnteriormente: "",

  created() {
    this.conhecimentoService = new ConhecimentoService();
  },

  methods: {
    callFindByRemetenteMethod() {
      this.lazyParams = {
        page: 0,
        sortOrder: "desc",
        sortField: "emissao",
      };
      this.findByRemetente();
    },
    findByRemetente() {
      if (this.cnpjPesquisadoAnteriormente == this.cnpj) {
        this.showWarn("Este CNPJ foi usado na consulta anterior!");
      } else {
        this.setIsPesquisandoESpinner(true, "Pesquisando...");
        this.isBtnShow = false;
        let response = this.conhecimentoService.findByRemetente(
          this.cnpj,
          this.lazyParams.page,
          this.lazyParams.sortOrder,
          this.lazyParams.sortField
        );
        response
          .then((data) => {
            this.conhecimentos = data.content;
            this.isRenderDatatable = true;
            this.h5Titulo =
              "Conhecimentos de " + this.conhecimentos[0].remetente.nome;
            this.totalRecords = data.totalElements;
          })
          .catch((error) => {
            console.log(error.request.status);
            let errorRequest = error.request;
            if (errorRequest.status == 404) {
              this.showWarn("Conhecimento nao encontrado. #404");
            } else
              this.showError(
                "Codigo de retorno nao filtrado. #" + errorRequest.status
              );
            this.isRenderDatatable = false;
            this.h5Titulo = "Encontrar por remetente";
            this.conhecimentos = null;
          })
          .finally(() => {
            this.isBtnShow = true;
            this.setIsPesquisandoESpinner(false, "");
            this.cnpjPesquisadoAnteriormente = this.cnpj;
          });
      }
    },
    onPage(event) {
      this.loading = true;
      this.lazyParams = event;
      this.verifyOrderToSort();
      this.cnpjPesquisadoAnteriormente = "";
      this.findByRemetente();
      this.loading = false;
    },
    onSort(event) {
      this.loading = true;
      this.lazyParams = event;
      this.verifyOrderToSort();
      this.cnpjPesquisadoAnteriormente = "";
      this.findByRemetente();
      this.loading = false;
    },
    verifyOrderToSort() {
      if (this.lazyParams.sortOrder == 1) {
        this.lazyParams.sortOrder = "ASC";
      } else this.lazyParams.sortOrder = "DESC";
    },
    setIsPesquisandoESpinner(condicao, msgProgresso) {
      this.isRenderSpinnerPesquisa = condicao;
      this.msgH4Pesquisa = msgProgresso;
    },

    formatCurrency(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },

    viewCurrentObject(object) {
      this.isViewObjectDialogVisible = true;
      this.currentConhecimento = object;
    },
    cleanCnpjVariable() {
      if (!this.cnpj.length == 0 && !this.conhecimentos.length == 0) {
        this.cnpj = "";
        this.conhecimentos = [];
      } else if (!this.cnpj.length == 0) {
        this.cnpj = "";
      } else if (!this.conhecimentos.length == 0) {
        this.conhecimentos = [];
      }
      this.isRenderDatatable = false;
      this.h5Titulo = "Encontrar por remetente";
    },
    showWarn(message) {
      this.$toast.add({
        severity: "warn",
        summary: "Warn Message",
        detail: message,
        life: 3000,
      });
    },
    showError(message) {
      console.log("show error");
      this.$toast.add({
        severity: "error",
        summary: "Error Message",
        detail: message,
        life: 3000,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.p-datatable-responsive-demo .p-datatable-tbody > tr > td .p-column-title {
  display: none;
}

@media screen and (max-width: 40em) {
  ::v-deep(.p-datatable) {
    &.p-datatable-responsive-demo {
      .p-datatable-thead > tr > th,
      .p-datatable-tfoot > tr > td {
        display: none !important;
      }

      .p-datatable-tbody > tr > td {
        text-align: left;
        display: block;
        width: 100%;
        float: left;
        clear: left;
        border: 0 none;

        .p-column-title {
          padding: 0.4rem;
          min-width: 30%;
          display: inline-block;
          margin: -0.4em 1em -0.4em -0.4rem;
          font-weight: bold;
        }

        &:last-child {
          border-bottom: 1px solid var(--surface-d);
        }
      }
    }
  }
}
</style>

