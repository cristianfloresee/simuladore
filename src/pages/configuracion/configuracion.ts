import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2/database-deprecated";
@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  public selected_category_id = 1;
  public selected_unit_id;
  public units_by_category_id;

  public all_categories: Array<any> = [];
  public all_units: Array<any> = [];
  public all_drivers: Array<any> = [];

  category_transport: FirebaseListObservable<any[]>;
  unit_transport: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private afDB: AngularFireDatabase,
  ) {

    this.selected_category_id = navParams.get('selected_category_id');
    console.log("institucion seleccionada (por defecto): ", this.selected_category_id);

    this.selected_unit_id = navParams.get('selected_unit_id');
    console.log("división seleccionada (por defecto): ", this.selected_unit_id);

    let loader = this.loadingCtrl.create({
      content: "Obteniendo Datos...",
    });

    loader.present().then(() => {

      this.category_transport = this.afDB.list('/transport_categories');
      this.unit_transport = afDB.list('/transport_units');

      this.category_transport.subscribe((data) => {
        this.all_categories = data;
        console.log("instituciones: ", this.all_categories);
      });

      this.unit_transport.subscribe((data) => {
        this.all_units = data;
        console.log("divisiones: ", this.all_units);
        loader.dismiss();
      });

      //this.selected_category_id = this.all_categories[0].id;
      //console.log("institucion seleccionada (por defecto): ", this.selected_category_id);

      this.onSelectCategory();
    });

  }


  onSelectCategory() {
    //item.key == this.selected_category_id;
    this.units_by_category_id = this.all_units.filter((item) => item.id_transport_category == this.selected_category_id);
    console.log("categoria seleccionada: ", this.selected_category_id);
    console.log("unidades de la categoria: ", this.units_by_category_id);
    this.selected_unit_id = this.units_by_category_id[0].id;
    //console.log("unidad seleccionada: ", this.selected_unit_id);
  }

  onSelectUnit() {
    console.log("");
    console.log("division seleccionada: ", this.selected_unit_id);

    //console.log(key_unit);
    //this.selected_unit_id = key_unit;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');
  }

  dismiss(selected_category_id, selected_unit_id) {


    let response = {
      selected_category_id,
      selected_unit_id,
    };


    this.viewCtrl.dismiss(response);
  }

}
